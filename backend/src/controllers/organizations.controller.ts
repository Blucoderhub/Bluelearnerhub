/**
 * Organizations Controller
 * ========================
 * Corporate & university ecosystem — licensing, talent pool, innovation challenges.
 */

import { Request, Response } from 'express';
import { db } from '../db';
import { eq, and, desc, ilike } from 'drizzle-orm';
import {
  organizations, orgMembers, talentPool, innovationChallenges,
} from '../db/schema-v2';
import { users } from '../db/schema';
import logger from '../utils/logger';

// ─── Organizations ────────────────────────────────────────────────────────────

export const listOrganizations = async (req: Request, res: Response) => {
  try {
    const { type, search } = req.query as Record<string, string>;

    let query = db.select().from(organizations).$dynamic();

    if (type) {
      query = query.where(eq(organizations.type, type as any));
    }

    const rows = await query.orderBy(desc(organizations.createdAt));

    const filtered = search
      ? rows.filter((o) => o.name.toLowerCase().includes(search.toLowerCase()))
      : rows;

    res.json({ success: true, data: filtered });
  } catch (err) {
    logger.error('listOrganizations error', err);
    res.status(500).json({ success: false, message: 'Failed to load organizations' });
  }
};

export const getOrganization = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const [org] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, slug));

    if (!org) return res.status(404).json({ success: false, message: 'Organization not found' });

    // Load members (top 10 visible)
    const members = await db
      .select({ user: users, role: orgMembers.role, joinedAt: orgMembers.joinedAt })
      .from(orgMembers)
      .leftJoin(users, eq(orgMembers.userId, users.id))
      .where(eq(orgMembers.orgId, org.id))
      .orderBy(orgMembers.joinedAt)
      .limit(10);

    // Load active challenges
    const challenges = await db
      .select()
      .from(innovationChallenges)
      .where(and(eq(innovationChallenges.orgId, org.id), eq(innovationChallenges.status, 'active')))
      .orderBy(desc(innovationChallenges.createdAt));

    res.json({ success: true, data: { ...org, members, challenges } });
  } catch (err) {
    logger.error('getOrganization error', err);
    res.status(500).json({ success: false, message: 'Failed to load organization' });
  }
};

export const createOrganization = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).user.id;
    const { name, slug, description, orgType, website, logoUrl } = req.body;

    // Slug uniqueness check
    const [existing] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, slug));

    if (existing) {
      return res.status(409).json({ success: false, message: 'Slug already taken' });
    }

    const [org] = await db
      .insert(organizations)
      .values({ name, slug, description, type: orgType, website, logoUrl })
      .returning();

    // Auto-add creator as ADMIN member
    await db
      .insert(orgMembers)
      .values({ orgId: org.id, userId: adminId, role: 'ADMIN' });

    res.status(201).json({ success: true, data: org });
  } catch (err) {
    logger.error('createOrganization error', err);
    res.status(500).json({ success: false, message: 'Failed to create organization' });
  }
};

// ─── Members ─────────────────────────────────────────────────────────────────

export const inviteMember = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).user.id;
    const orgId   = parseInt(req.params.id);
    const { userId, role = 'MEMBER' } = req.body;

    // Verify requester is org admin
    const [adminMember] = await db
      .select()
      .from(orgMembers)
      .where(and(eq(orgMembers.orgId, orgId), eq(orgMembers.userId, adminId), eq(orgMembers.role, 'ADMIN')));

    if (!adminMember) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const [existing] = await db
      .select()
      .from(orgMembers)
      .where(and(eq(orgMembers.orgId, orgId), eq(orgMembers.userId, userId)));

    if (existing) {
      return res.status(409).json({ success: false, message: 'User already a member' });
    }

    const [member] = await db
      .insert(orgMembers)
      .values({ orgId, userId, role })
      .returning();

    res.status(201).json({ success: true, data: member });
  } catch (err) {
    logger.error('inviteMember error', err);
    res.status(500).json({ success: false, message: 'Failed to invite member' });
  }
};

// ─── Talent Pool ─────────────────────────────────────────────────────────────

export const listTalentPool = async (req: Request, res: Response) => {
  try {
    const orgId = parseInt(req.params.id);
    const adminId = (req as any).user.id;

    // Verify requester has org access
    const [member] = await db
      .select()
      .from(orgMembers)
      .where(and(eq(orgMembers.orgId, orgId), eq(orgMembers.userId, adminId)));

    if (!member) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const pool = await db
      .select({ entry: talentPool, user: users })
      .from(talentPool)
      .leftJoin(users, eq(talentPool.candidateId, users.id))
      .where(eq(talentPool.orgId, orgId))
      .orderBy(desc(talentPool.addedAt));

    res.json({ success: true, data: pool });
  } catch (err) {
    logger.error('listTalentPool error', err);
    res.status(500).json({ success: false, message: 'Failed to load talent pool' });
  }
};

export const addToTalentPool = async (req: Request, res: Response) => {
  try {
    const orgId  = parseInt(req.params.id);
    const userId = (req as any).user.id;
    const { stage = 'prospects', notes } = req.body;

    const [existing] = await db
      .select()
      .from(talentPool)
      .where(and(eq(talentPool.orgId, orgId), eq(talentPool.candidateId, userId)));

    if (existing) {
      const [updated] = await db
        .update(talentPool)
        .set({ stage, notes })
        .where(and(eq(talentPool.orgId, orgId), eq(talentPool.candidateId, userId)))
        .returning();
      return res.json({ success: true, data: updated });
    }

    const [entry] = await db
      .insert(talentPool)
      .values({ orgId, candidateId: userId, stage, notes })
      .returning();

    res.status(201).json({ success: true, data: entry });
  } catch (err) {
    logger.error('addToTalentPool error', err);
    res.status(500).json({ success: false, message: 'Failed to update talent pool' });
  }
};

// ─── Innovation Challenges ────────────────────────────────────────────────────

export const listChallenges = async (req: Request, res: Response) => {
  try {
    const { active } = req.query;

    let query = db.select().from(innovationChallenges).$dynamic();

    if (active === 'true') {
      query = query.where(eq(innovationChallenges.status, 'active'));
    }

    const challenges = await query.orderBy(desc(innovationChallenges.createdAt));

    res.json({ success: true, data: challenges });
  } catch (err) {
    logger.error('listChallenges error', err);
    res.status(500).json({ success: false, message: 'Failed to load challenges' });
  }
};

export const createChallenge = async (req: Request, res: Response) => {
  try {
    const orgId     = parseInt(req.params.id);
    const creatorId = (req as any).user.id;
    const { title, description, deadline, prizeDescription, evaluationCriteria } = req.body;

    // Verify creator is org member
    const [member] = await db
      .select()
      .from(orgMembers)
      .where(and(eq(orgMembers.orgId, orgId), eq(orgMembers.userId, creatorId)));

    if (!member) {
      return res.status(403).json({ success: false, message: 'Not an org member' });
    }

    const [challenge] = await db
      .insert(innovationChallenges)
      .values({
        orgId,
        title,
        description,
        deadline: deadline ? new Date(deadline) : null,
        prizeDescription,
        evaluationCriteria,
      })
      .returning();

    res.status(201).json({ success: true, data: challenge });
  } catch (err) {
    logger.error('createChallenge error', err);
    res.status(500).json({ success: false, message: 'Failed to create challenge' });
  }
};

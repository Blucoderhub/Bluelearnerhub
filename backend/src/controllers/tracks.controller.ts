/**
 * Learning Tracks Controller
 * ==========================
 * Structured career learning paths — enroll, track progress, issue certificates.
 */

import { Request, Response } from 'express';
import { db } from '../db';
import { eq, and, desc, sql } from 'drizzle-orm';
import { learningTracks, trackCourses, trackEnrollments } from '../db/schema-v2';
import { courses } from '../db/schema';
import { GamificationService } from '../services/gamification.service';
import logger from '../utils/logger';

export const listTracks = async (req: Request, res: Response) => {
  try {
    const { domain, difficulty } = req.query as Record<string, string>;

    const rows = await db
      .select()
      .from(learningTracks)
      .where(
        and(
          eq(learningTracks.isPublished, true),
          domain ? eq(learningTracks.domain, domain) : undefined,
          difficulty ? eq(learningTracks.difficulty, difficulty as 'beginner' | 'intermediate' | 'advanced' | 'expert') : undefined,
        )
      )
      .orderBy(desc(learningTracks.enrollmentCount));

    res.json({ success: true, data: rows });
  } catch (err) {
    logger.error('listTracks error', err);
    res.status(500).json({ success: false, message: 'Failed to load tracks' });
  }
};

export const getTrack = async (req: Request, res: Response) => {
  try {
    const slug = String(req.params.slug);
    const userId    = req.user?.id;

    const [track] = await db
      .select()
      .from(learningTracks)
      .where(and(eq(learningTracks.slug, slug), eq(learningTracks.isPublished, true)));

    if (!track) return res.status(404).json({ success: false, message: 'Track not found' });

    // Load courses in this track
    const trackCoursesData = await db
      .select({ course: courses, orderIndex: trackCourses.orderIndex, isRequired: trackCourses.isRequired })
      .from(trackCourses)
      .leftJoin(courses, eq(trackCourses.courseId, courses.id))
      .where(eq(trackCourses.trackId, track.id))
      .orderBy(trackCourses.orderIndex);

    // Check enrollment
    let enrollment = null;
    if (userId) {
      const [e] = await db
        .select()
        .from(trackEnrollments)
        .where(and(eq(trackEnrollments.userId, userId), eq(trackEnrollments.trackId, track.id)));
      enrollment = e ?? null;
    }

    res.json({ success: true, data: { ...track, courses: trackCoursesData, enrollment } });
  } catch (err) {
    logger.error('getTrack error', err);
    res.status(500).json({ success: false, message: 'Failed to load track' });
  }
};

export const enrollInTrack = async (req: Request, res: Response) => {
  try {
    const userId  = req.user!.id;
    const trackId = parseInt(String(req.params.id));

    if (isNaN(trackId) || trackId <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid track id' });
    }

    const [existing] = await db
      .select()
      .from(trackEnrollments)
      .where(and(eq(trackEnrollments.userId, userId), eq(trackEnrollments.trackId, trackId)));

    if (existing) return res.json({ success: true, data: existing, alreadyEnrolled: true });

    const [enrollment] = await db
      .insert(trackEnrollments)
      .values({ userId, trackId, progressPercentage: 0 })
      .returning();

    // Increment enrollment counter atomically
    await db
      .update(learningTracks)
      .set({ enrollmentCount: sql`${learningTracks.enrollmentCount} + 1` })
      .where(eq(learningTracks.id, trackId));

    await GamificationService.awardXP(userId, 10, 'TRACK_ENROLLED');

    res.status(201).json({ success: true, data: enrollment });
  } catch (err) {
    logger.error('enrollInTrack error', err);
    res.status(500).json({ success: false, message: 'Enrollment failed' });
  }
};

export const getTrackProgress = async (req: Request, res: Response) => {
  try {
    const userId  = req.user!.id;
    const trackId = parseInt(String(req.params.id));

    const [enrollment] = await db
      .select()
      .from(trackEnrollments)
      .where(and(eq(trackEnrollments.userId, userId), eq(trackEnrollments.trackId, trackId)));

    if (!enrollment) return res.status(404).json({ success: false, message: 'Not enrolled' });

    res.json({ success: true, data: enrollment });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load progress' });
  }
};



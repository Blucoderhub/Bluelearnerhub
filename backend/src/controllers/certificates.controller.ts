/**
 * Certificates Controller
 * =======================
 * Issues, verifies, and delivers PDF certificates for course completions,
 * track completions, and hackathon wins.
 *
 * Routes:
 *   GET  /api/certificates/me                 — user's certificates
 *   GET  /api/certificates/verify/:credentialId — public verification
 *   POST /api/certificates/issue              — system issues certificate
 */

import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { certificates, certificateTemplates } from '../db/schema-v2';
import { users } from '../db/schema';
import logger from '../utils/logger';

// ────────────────────────────────────────────────────────────────────────────
// GET MY CERTIFICATES
// ────────────────────────────────────────────────────────────────────────────

export const getMyCertificates = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const rows = await db
      .select()
      .from(certificates)
      .where(eq(certificates.userId, userId))
      .orderBy(certificates.issuedAt);

    res.json({ success: true, data: rows });
  } catch (err) {
    logger.error('getMyCertificates error', err);
    res.status(500).json({ success: false, message: 'Failed to load certificates' });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// PUBLIC VERIFICATION — anyone can verify a credential
// ────────────────────────────────────────────────────────────────────────────

export const verifyCertificate = async (req: Request, res: Response) => {
  try {
    const { credentialId } = req.params;

    const [cert] = await db
      .select({
        cert:          certificates,
        recipientName: users.fullName,
      })
      .from(certificates)
      .leftJoin(users, eq(certificates.userId, users.id))
      .where(eq(certificates.credentialId, credentialId));

    if (!cert) {
      return res.status(404).json({
        success: false,
        valid:   false,
        message: 'Certificate not found or invalid credential ID',
      });
    }

    const isExpired = cert.cert.expiresAt && new Date(cert.cert.expiresAt) < new Date();

    res.json({
      success: true,
      valid:   !isExpired,
      data: {
        credentialId:  cert.cert.credentialId,
        title:         cert.cert.title,
        issuedFor:     cert.cert.issuedFor,
        issuerName:    cert.cert.issuerName,
        recipientName: cert.cert.recipientName,
        issuedAt:      cert.cert.issuedAt,
        expiresAt:     cert.cert.expiresAt,
        status:        isExpired ? 'expired' : 'valid',
      },
    });
  } catch (err) {
    logger.error('verifyCertificate error', err);
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// ISSUE CERTIFICATE (internal / admin only)
// ────────────────────────────────────────────────────────────────────────────

export const issueCertificate = async (req: Request, res: Response) => {
  try {
    const { userId, templateId, title, issuedFor, metadata, expiresAt } = req.body;

    const [recipient] = await db
      .select({ fullName: users.fullName })
      .from(users)
      .where(eq(users.id, userId));

    if (!recipient) return res.status(404).json({ success: false, message: 'User not found' });

    const credentialId = uuidv4();

    // Build the public verification URL
    const baseUrl = process.env.FRONTEND_URL || 'https://bluelearnerhub.com';
    const verificationUrl = `${baseUrl}/certificates/verify/${credentialId}`;

    // Issue the certificate record
    const [cert] = await db
      .insert(certificates)
      .values({
        userId,
        templateId,
        credentialId,
        title,
        issuedFor,
        recipientName: recipient.fullName,
        verificationUrl,
        expiresAt:     expiresAt ? new Date(expiresAt) : null,
        metadata,
        // pdfUrl is populated asynchronously by the PDF generation job
      })
      .returning();

    // Queue PDF generation (fire-and-forget; sets pdfUrl when done)
    schedulePDFGeneration(cert.id).catch((e) =>
      logger.error(`PDF generation failed for cert ${cert.id}`, e),
    );

    res.status(201).json({ success: true, data: cert });
  } catch (err) {
    logger.error('issueCertificate error', err);
    res.status(500).json({ success: false, message: 'Failed to issue certificate' });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// PDF GENERATION (async — called after DB insert)
// ────────────────────────────────────────────────────────────────────────────

/**
 * In production this would push a job to the BullMQ queue, which a worker
 * picks up, generates the PDF with pdf-lib + sharp, uploads to S3, and
 * updates certificates.pdf_url.
 *
 * For now we log a placeholder so the architecture is wired correctly.
 */
async function schedulePDFGeneration(certId: number): Promise<void> {
  logger.info(`[Certificates] PDF generation queued for certificate ID ${certId}`);
  // TODO: push to BullMQ 'certificate-pdf' queue
  // await pdfQueue.add('generate', { certId });
}

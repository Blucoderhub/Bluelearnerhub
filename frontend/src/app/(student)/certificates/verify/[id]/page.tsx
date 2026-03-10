'use client';

import { motion } from 'framer-motion';
import { Shield, CheckCircle2, XCircle, Award, Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { format } from 'date-fns';

// Mock — in production: fetch /api/certificates/verify/:id
const MOCK_CERT = {
  valid: true,
  credentialId: 'BLH-2026-CE-001A2B3C',
  title: 'Full-Stack Software Engineering',
  issuedFor: 'Software Engineering Track',
  issuerName: 'BlueLearnerHub',
  recipientName: 'Arjun Sharma',
  issuedAt: '2026-02-15T00:00:00Z',
  expiresAt: null,
  status: 'valid',
};

export default function VerifyCertificatePage({ params }: { params: { id: string } }) {
  const cert = MOCK_CERT;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
          {/* Verification badge */}
          <div className="mb-6 text-center">
            {cert.valid ? (
              <div className="inline-flex flex-col items-center gap-3">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full bg-emerald-950 flex items-center justify-center">
                    <Shield className="h-10 w-10 text-emerald-400" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-emerald-500 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-emerald-400">Certificate Verified</h1>
                  <p className="text-sm text-gray-400 mt-1">This credential is authentic and has been issued by BlueLearnerHub</p>
                </div>
              </div>
            ) : (
              <div className="inline-flex flex-col items-center gap-3">
                <div className="h-20 w-20 rounded-full bg-red-950 flex items-center justify-center">
                  <XCircle className="h-10 w-10 text-red-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-red-400">Invalid Certificate</h1>
                  <p className="text-sm text-gray-400 mt-1">This credential could not be verified</p>
                </div>
              </div>
            )}
          </div>

          {/* Certificate details */}
          <Card className="bg-gray-900 border-gray-800">
            <div className="h-2 rounded-t-xl bg-gradient-to-r from-blue-600 to-purple-600" />
            <CardContent className="p-6">
              <div className="text-center mb-5">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Certificate of Achievement</p>
                <h2 className="text-xl font-bold text-white">{cert.title}</h2>
                <p className="text-sm text-gray-400 mt-1">{cert.issuedFor}</p>
              </div>

              <div className="flex items-center justify-center gap-2 py-4 border-y border-gray-800">
                <Award className="h-5 w-5 text-amber-400" />
                <div className="text-center">
                  <p className="text-xs text-gray-500">Awarded to</p>
                  <p className="text-lg font-bold text-white">{cert.recipientName}</p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Credential ID</span>
                  <span className="font-mono text-gray-300 text-xs">{cert.credentialId}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Issued by</span>
                  <span className="text-gray-300">{cert.issuerName}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Issue date</span>
                  <span className="text-gray-300">{format(new Date(cert.issuedAt), 'MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Status</span>
                  <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Valid · Does not expire
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="mt-4 text-center text-xs text-gray-600">
            Verified on BlueLearnerHub · {format(new Date(), 'PPP')}
          </p>

          <div className="mt-6 flex gap-3 justify-center">
            <Link href="/">
              <Button variant="outline" className="border-gray-700 text-gray-400 hover:text-white gap-1.5">
                <ExternalLink className="h-4 w-4" /> Visit BlueLearnerHub
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

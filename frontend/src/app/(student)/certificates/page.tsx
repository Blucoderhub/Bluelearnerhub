'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Award, Download, Share2, ExternalLink, CheckCircle2,
  Shield, Calendar, Trophy, Sparkles, Copy, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { format } from 'date-fns';
import { certificatesAPI } from '@/lib/api-civilization';

const MOCK_CERTS = [
  {
    id: 1,
    credentialId: 'BLH-2026-CE-001A2B3C',
    title: 'Full-Stack Software Engineering',
    issuedFor: 'Software Engineering Track',
    type: 'track',
    issuedAt: '2026-02-15',
    issuerName: 'BlueLearnerHub',
    skills: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'TypeScript'],
    verificationUrl: '/certificates/verify/BLH-2026-CE-001A2B3C',
    gradient: 'from-blue-600 to-purple-600',
  },
  {
    id: 2,
    credentialId: 'BLH-2026-HK-002D4E5F',
    title: 'Hackathon Winner — AI_REVOLUTION_2026',
    issuedFor: 'AI_REVOLUTION_2026 Hackathon',
    type: 'hackathon',
    issuedAt: '2026-01-28',
    issuerName: 'BlueLearnerHub',
    skills: ['Machine Learning', 'FastAPI', 'System Design'],
    verificationUrl: '/certificates/verify/BLH-2026-HK-002D4E5F',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 3,
    credentialId: 'BLH-2026-CR-003F6G7H',
    title: 'Machine Learning Fundamentals',
    issuedFor: 'ML Fundamentals Course',
    type: 'course',
    issuedAt: '2026-01-10',
    issuerName: 'BlueLearnerHub',
    skills: ['Python', 'scikit-learn', 'Neural Networks', 'Data Analysis'],
    verificationUrl: '/certificates/verify/BLH-2026-CR-003F6G7H',
    gradient: 'from-emerald-500 to-teal-600',
  },
];

const CERT_TYPE_ICONS = { track: Trophy, hackathon: Award, course: Sparkles };
const CERT_TYPE_LABELS = { track: 'Career Track', hackathon: 'Hackathon', course: 'Course' };

function CertificateCard({ cert }: { cert: typeof MOCK_CERTS[0] }) {
  const [copied, setCopied] = useState(false);
  const TypeIcon = CERT_TYPE_ICONS[cert.type as keyof typeof CERT_TYPE_ICONS] ?? Award;

  const copyLink = async () => {
    await navigator.clipboard.writeText(`https://bluelearnerhub.com${cert.verificationUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="overflow-hidden bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
      {/* Certificate visual */}
      <div className={`relative h-40 bg-gradient-to-br ${cert.gradient} p-6`}>
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="absolute rounded-full border border-white" style={{
              width: `${60 + i * 40}px`, height: `${60 + i * 40}px`,
              top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            }} />
          ))}
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <TypeIcon className="h-5 w-5 text-white" />
            <Badge className="bg-white/20 text-white border-0 text-xs">
              {CERT_TYPE_LABELS[cert.type as keyof typeof CERT_TYPE_LABELS]}
            </Badge>
          </div>
          <h3 className="text-lg font-bold text-white leading-snug">{cert.title}</h3>
        </div>
        <div className="absolute bottom-4 right-4">
          <Shield className="h-8 w-8 text-white/30" />
        </div>
      </div>

      <CardContent className="p-5">
        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="h-3.5 w-3.5" />
            Issued {format(new Date(cert.issuedAt), 'MMMM d, yyyy')} by {cert.issuerName}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            Credential ID: <span className="font-mono text-gray-400">{cert.credentialId}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {cert.skills.map((s) => (
            <span key={s} className="rounded-md bg-gray-800 px-2 py-0.5 text-xs text-gray-300">{s}</span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={cert.verificationUrl} className="flex-1">
            <Button variant="outline" size="sm" className="w-full gap-1.5 border-gray-700 text-gray-300 hover:text-white text-xs">
              <ExternalLink className="h-3.5 w-3.5" /> Verify
            </Button>
          </Link>
          <Button onClick={copyLink} variant="outline" size="sm" className="gap-1.5 border-gray-700 text-gray-300 hover:text-white text-xs">
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Share'}
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 border-gray-700 text-gray-300 hover:text-white text-xs">
            <Download className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CertificatesPage() {
  const [certs, setCerts] = useState(MOCK_CERTS);

  useEffect(() => {
    certificatesAPI.mine()
      .then((d) => { if (d.data?.length) setCerts(d.data); })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-gray-800 bg-gradient-to-b from-gray-900 to-gray-950 px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-2 flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-400" />
              <span className="text-sm font-medium text-amber-400 uppercase tracking-wider">Credentials</span>
            </div>
            <h1 className="text-3xl font-bold">My Certificates</h1>
            <p className="mt-2 text-gray-400">Verifiable credentials for courses, tracks, and hackathon achievements.</p>
          </motion.div>

          <div className="mt-6 flex gap-6">
            {[
              { label: 'Earned',       value: MOCK_CERTS.length,                              icon: Award,        color: 'text-amber-400' },
              { label: 'Course Certs', value: MOCK_CERTS.filter(c => c.type === 'course').length, icon: Sparkles, color: 'text-blue-400' },
              { label: 'Track Certs',  value: MOCK_CERTS.filter(c => c.type === 'track').length,  icon: Trophy,   color: 'text-purple-400' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${color}`} />
                <span className="font-bold">{value}</span>
                <span className="text-sm text-gray-500">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8">
        {certs.length === 0 ? (
          <div className="py-20 text-center">
            <Award className="mx-auto mb-4 h-16 w-16 opacity-20" />
            <h2 className="text-lg font-semibold text-gray-400 mb-2">No certificates yet</h2>
            <p className="text-sm text-gray-500 mb-6">Complete courses and tracks to earn verifiable certificates.</p>
            <Link href="/learning-tracks">
              <Button className="bg-blue-600 hover:bg-blue-700">Browse Learning Tracks</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {certs.map((cert: any, i: number) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <CertificateCard cert={cert} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  Clock, Users, Star, Award, BookOpen, CheckCircle2,
  ChevronRight, Lock, Play, Code2, ChevronDown, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { tracksAPI } from '@/lib/api-civilization';

const MOCK_TRACK = {
  id: 1,
  title: 'Full-Stack Software Engineer',
  slug: 'full-stack-engineer',
  description: 'Master the complete web development stack — from pixel-perfect UIs to scalable backend APIs and cloud deployment. This track is designed to take you from foundational concepts to building production-grade applications.',
  careerOutcome: 'Full-Stack Software Engineer',
  estimatedWeeks: 24,
  difficulty: 'intermediate',
  enrollmentCount: 8420,
  rating: 4.9,
  reviewCount: 1240,
  hasCertificate: true,
  gradient: 'from-blue-600 to-purple-600',
  phases: [
    {
      phase: 1, title: 'Frontend Foundations', weeks: 4,
      courses: [
        { id: 1, title: 'Modern JavaScript & TypeScript', lessons: 28, hours: 12, locked: false },
        { id: 2, title: 'React 18: From Zero to Hero',   lessons: 35, hours: 15, locked: false },
      ],
    },
    {
      phase: 2, title: 'Backend Engineering', weeks: 6,
      courses: [
        { id: 3, title: 'Node.js & Express Mastery',    lessons: 30, hours: 14, locked: false },
        { id: 4, title: 'PostgreSQL & Database Design', lessons: 22, hours: 10, locked: false },
        { id: 5, title: 'REST APIs & GraphQL',          lessons: 18, hours: 8,  locked: true  },
      ],
    },
    {
      phase: 3, title: 'Full-Stack Projects', weeks: 8,
      courses: [
        { id: 6, title: 'Build a SaaS Product End-to-End', lessons: 42, hours: 22, locked: true },
        { id: 7, title: 'Authentication & Security',        lessons: 20, hours: 9,  locked: true },
      ],
    },
    {
      phase: 4, title: 'Production & DevOps', weeks: 6,
      courses: [
        { id: 8, title: 'Docker & Kubernetes Fundamentals', lessons: 25, hours: 12, locked: true },
      ],
    },
  ],
  skills: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Docker', 'AWS', 'GraphQL'],
  instructors: [
    { name: 'Dr. Vijay Kumar', role: 'Principal Engineer @ Google', avatar: 'V' },
    { name: 'Kavitha Reddy',   role: 'Senior Engineer @ Stripe',   avatar: 'K' },
  ],
};

// Normalize the API response into the shape the page expects
function normalizeTrack(data: any) {
  if (!data) return null;
  const track = data.track ?? data;
  const courses = data.courses ?? track.courses ?? [];
  const enrollment = data.enrollment ?? track.enrollment ?? null;

  // Build phases from flat course list if needed
  let phases = track.phases ?? [];
  if (!phases.length && courses.length) {
    phases = [{ phase: 1, title: 'Course Content', weeks: track.estimatedWeeks ?? 12, courses }];
  }

  return {
    id: track.id ?? 1,
    title: track.title ?? MOCK_TRACK.title,
    slug: track.slug ?? MOCK_TRACK.slug,
    description: track.description ?? MOCK_TRACK.description,
    difficulty: track.difficulty ?? 'intermediate',
    estimatedWeeks: track.estimatedWeeks ?? track.estimated_weeks ?? MOCK_TRACK.estimatedWeeks,
    enrollmentCount: track.enrollmentCount ?? track.enrollment_count ?? MOCK_TRACK.enrollmentCount,
    rating: track.rating ?? MOCK_TRACK.rating,
    reviewCount: track.reviewCount ?? track.review_count ?? MOCK_TRACK.reviewCount,
    hasCertificate: track.hasCertificate ?? track.has_certificate ?? true,
    gradient: track.gradient ?? MOCK_TRACK.gradient,
    phases: phases.length ? phases : MOCK_TRACK.phases,
    skills: track.skills ?? track.skillsGained ?? MOCK_TRACK.skills,
    instructors: track.instructors ?? MOCK_TRACK.instructors,
    isEnrolled: !!enrollment,
    progressPercent: enrollment?.progressPercentage ?? 0,
  };
}

function TrackSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-gray-800 rounded w-2/3" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-800 rounded w-full" />
        <div className="h-4 bg-gray-800 rounded w-5/6" />
      </div>
      <div className="flex gap-4">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-5 w-24 bg-gray-800 rounded" />)}
      </div>
    </div>
  );
}

export default function TrackDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [track, setTrack] = useState<ReturnType<typeof normalizeTrack> | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [expandedPhase, setExpanded] = useState<number>(1);

  useEffect(() => {
    tracksAPI.get(slug)
      .then((data: any) => {
        const normalized = normalizeTrack(data);
        if (normalized) {
          setTrack(normalized);
          setIsEnrolled(normalized.isEnrolled);
          setProgressPercent(normalized.progressPercent ?? 0);
        } else {
          setTrack(normalizeTrack(MOCK_TRACK)!);
        }
      })
      .catch(() => setTrack(normalizeTrack(MOCK_TRACK)!))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleEnroll = async () => {
    if (!track) return;
    setEnrolling(true);
    try {
      await tracksAPI.enroll(track.id);
      setIsEnrolled(true);
      toast.success('Enrolled successfully! Your learning journey begins now.');
    } catch {
      toast.error('Enrollment failed. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  const t = track ?? normalizeTrack(MOCK_TRACK)!;
  const totalCourses = t?.phases?.reduce((s: number, p: any) => s + (p.courses?.length ?? 0), 0) ?? 0;
  const totalHours = t?.phases?.reduce(
    (s: number, p: any) => s + (p.courses?.reduce((cs: number, c: any) => cs + (c.hours ?? 0), 0) ?? 0), 0
  ) ?? 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <div className="border-b border-gray-800 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
            <Link href="/learning-tracks" className="hover:text-white transition-colors">Learning Tracks</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-300 truncate max-w-xs">{loading ? '...' : t.title}</span>
          </div>

          {loading ? (
            <TrackSkeleton />
          ) : (
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <div className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${t.gradient} px-4 py-1.5 mb-4`}>
                  <Code2 className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium text-white">Career Track</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-3">{t.title}</h1>
                <p className="text-gray-400 leading-relaxed mb-5">{t.description}</p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-5">
                  <span className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-foreground/70 fill-foreground/70" />
                    <strong className="text-white">{t.rating}</strong> ({t.reviewCount?.toLocaleString()} reviews)
                  </span>
                  <span className="flex items-center gap-1.5"><Users className="h-4 w-4" />{t.enrollmentCount?.toLocaleString()} enrolled</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{t.estimatedWeeks} weeks · {totalHours}h content</span>
                  <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" />{totalCourses} courses</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge className="bg-blue-900/50 text-blue-400 text-xs">{t.difficulty}</Badge>
                  {t.hasCertificate && (
                    <Badge className="bg-muted text-foreground/70 text-xs gap-1">
                      <Award className="h-3 w-3" /> Certificate included
                    </Badge>
                  )}
                </div>

                {/* Instructors */}
                <div className="flex gap-4 flex-wrap">
                  {(t.instructors ?? []).map((inst: any) => (
                    <div key={inst.name} className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold">
                        {inst.avatar ?? inst.name?.[0] ?? '?'}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-white">{inst.name}</p>
                        <p className="text-[10px] text-gray-500">{inst.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enroll card */}
              <div className="w-full md:w-72 shrink-0">
                <Card className="bg-gray-900 border-gray-700 sticky top-6">
                  <div className={`h-2 rounded-t-xl bg-gradient-to-r ${t.gradient}`} />
                  <CardContent className="p-5">
                    {isEnrolled && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">Your progress</p>
                        <Progress value={progressPercent} className="h-2 mb-1" />
                        <p className="text-xs text-gray-400">{progressPercent}% complete</p>
                      </div>
                    )}
                    <div className="space-y-2 text-sm mb-5">
                      {[
                        `${totalCourses} courses across ${t.phases?.length ?? 0} phases`,
                        `${totalHours}+ hours of content`,
                        `${t.estimatedWeeks}-week structured curriculum`,
                        'Industry-verified certificate',
                        'Lifetime access',
                      ].map((feat) => (
                        <div key={feat} className="flex items-center gap-2 text-gray-300">
                          <CheckCircle2 className="h-3.5 w-3.5 text-foreground/80 shrink-0" />
                          <span className="text-xs">{feat}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={isEnrolled ? undefined : handleEnroll}
                      disabled={enrolling}
                      className={`w-full font-semibold gap-2 ${isEnrolled ? 'bg-primary/80 hover:bg-primary/90' : `bg-gradient-to-r ${t.gradient} hover:opacity-90`}`}
                    >
                      {enrolling && <Loader2 className="h-4 w-4 animate-spin" />}
                      {enrolling ? 'Enrolling...' : isEnrolled ? '✓ Continue Learning' : 'Enroll Free'}
                    </Button>
                    <p className="mt-2 text-center text-xs text-gray-600">30-day money-back guarantee</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Curriculum */}
      {!loading && t && (
        <div className="mx-auto max-w-5xl px-6 py-10">
          <h2 className="text-xl font-bold text-white mb-2">Track Curriculum</h2>
          <p className="text-sm text-gray-400 mb-6">
            {totalCourses} courses · {t.phases?.length ?? 0} phases · {t.estimatedWeeks} weeks
          </p>

          <div className="space-y-3">
            {(t.phases ?? []).map((phase: any) => (
              <Card key={phase.phase} className="bg-gray-900 border-gray-800 overflow-hidden">
                <button
                  onClick={() => setExpanded(expandedPhase === phase.phase ? 0 : phase.phase)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${t.gradient} text-xs font-bold text-white`}>
                      {phase.phase}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{phase.title}</p>
                      <p className="text-xs text-gray-500">{phase.courses?.length ?? 0} courses · {phase.weeks} weeks</p>
                    </div>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${expandedPhase === phase.phase ? 'rotate-180' : ''}`} />
                </button>

                {expandedPhase === phase.phase && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }}>
                    {(phase.courses ?? []).map((course: any) => (
                      <div key={course.id} className="flex items-center gap-3 px-5 py-3 border-t border-gray-800">
                        {course.locked ? (
                          <Lock className="h-4 w-4 text-gray-600 shrink-0" />
                        ) : (
                          <Play className="h-4 w-4 text-blue-400 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${course.locked ? 'text-gray-500' : 'text-white'}`}>{course.title}</p>
                          <p className="text-xs text-gray-600">{course.lessons} lessons · {course.hours}h</p>
                        </div>
                        {!course.locked && (
                          <Badge className="bg-muted text-foreground/70 text-[10px]">Free</Badge>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </Card>
            ))}
          </div>

          {/* Skills */}
          {(t.skills ?? []).length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold text-white mb-4">Skills You'll Gain</h2>
              <div className="flex flex-wrap gap-2">
                {t.skills.map((skill: string) => (
                  <span key={skill} className="rounded-xl bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

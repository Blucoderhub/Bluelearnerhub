import { redirect } from 'next/navigation';

export default async function CoursePage({ 
  params 
}: { 
  params: Promise<{ pathId: string; courseId: string }> 
}) {
  const { pathId, courseId } = await params;
  // Redirect to the first lesson of the course
  // For now, redirecting to 'lesson-1' as per the pattern in tutorials/page.tsx
  redirect(`/tutorials/${pathId}/${courseId}/lesson-1`);
}

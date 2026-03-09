import { redirect } from 'next/navigation';

export default function CoursePage({ 
  params 
}: { 
  params: { pathId: string; courseId: string } 
}) {
  // Redirect to the first lesson of the course
  // For now, redirecting to 'lesson-1' as per the pattern in tutorials/page.tsx
  redirect(`/tutorials/${params.pathId}/${params.courseId}/lesson-1`);
}

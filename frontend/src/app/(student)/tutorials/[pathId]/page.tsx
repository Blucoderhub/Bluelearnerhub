import { redirect } from 'next/navigation';

export default function PathPage() {
  // Redirect back to the tutorials library if pathId is accessed directly
  redirect('/tutorials');
}

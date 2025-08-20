import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to server-side search page
  redirect('/search/server');
}
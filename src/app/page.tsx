import { redirect } from 'next/navigation';

// Redirect root to default locale homepage.
// Middleware handles unauthenticated users → /login.
export default function RootPage() {
  redirect('/vi');
}

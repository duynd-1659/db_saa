import { createClient } from '@/libs/supabase/server';
import { Link, redirect } from '@/i18n/navigation';
import { RoleForm } from '@/components/admin/RoleForm';

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<React.ReactElement> {
  const { locale } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: '/login', locale });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user?.id)
    .single();

  const currentRole = profile?.role ?? 'user';

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <Link href="/" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Home
      </Link>
      <h1 className="mb-6 text-xl font-bold text-gray-900">Admin Panel</h1>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm mb-6">
        <h2 className="mb-4 text-sm font-semibold text-gray-500 uppercase">My Role</h2>
        <RoleForm currentRole={currentRole} email={user?.email ?? ''} />
      </div>

      <Link href="/admin/event" className="text-sm text-blue-600 hover:underline">
        Go to Event Settings →
      </Link>
    </div>
  );
}

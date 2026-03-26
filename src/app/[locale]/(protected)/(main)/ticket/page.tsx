import { createClient } from '@/libs/supabase/server';
import { redirect } from '@/i18n/navigation';
import { QRCodeDisplay } from '@/components/homepage/QRCodeDisplay';

export default async function TicketPage({
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

  return (
    <main className="bg-black min-h-screen flex items-center justify-center">
      <QRCodeDisplay userId={user!.id} />
    </main>
  );
}

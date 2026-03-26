import { Link } from '@/i18n/navigation';
import { createClient } from '@/libs/supabase/server';
import { EventForm } from '@/components/admin/EventForm';

const FALLBACK_DATETIME = '2026-12-31T18:30:00+07:00';

export default async function AdminEventPage(): Promise<React.ReactElement> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('app_config')
    .select('value')
    .eq('key', 'event_start_datetime')
    .single();

  const currentDatetime = data?.value ?? FALLBACK_DATETIME;

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <Link href="/" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Home
      </Link>
      <h1 className="mb-6 text-xl font-bold text-gray-900">Admin - Event Settings</h1>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-500 uppercase">Event Start Datetime</h2>
        <p className="mb-4 text-sm text-gray-500">
          Current: <code className="rounded bg-gray-100 px-1 py-0.5">{currentDatetime}</code>
        </p>
        <EventForm currentDatetime={currentDatetime} />
      </div>
    </div>
  );
}

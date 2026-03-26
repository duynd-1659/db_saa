'use client';

import { useActionState } from 'react';
import { updateEventStartDatetime } from '@/services/admin-service';

interface EventFormProps {
  currentDatetime: string;
}

type FormState = { message: string; success: boolean } | null;

async function handleSubmit(_prev: FormState, formData: FormData): Promise<FormState> {
  const result = await updateEventStartDatetime(formData);
  if (result.success) {
    return { message: 'Updated successfully!', success: true };
  }
  return { message: result.error, success: false };
}

export function EventForm({ currentDatetime }: EventFormProps): React.ReactElement {
  const [state, action, pending] = useActionState(handleSubmit, null);

  // Convert ISO-8601 to datetime-local format (YYYY-MM-DDTHH:mm)
  const defaultValue = toDatetimeLocalValue(currentDatetime);

  return (
    <form action={action} className="flex flex-col gap-4 max-w-md">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">Event Start Datetime</span>
        <input
          type="datetime-local"
          name="event_start_datetime_local"
          defaultValue={defaultValue}
          required
          className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      {/* Hidden field to send ISO-8601 value with timezone */}
      <input type="hidden" name="event_start_datetime" />

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        onClick={(e) => {
          const form = e.currentTarget.closest('form');
          if (!form) return;
          const localInput = form.querySelector<HTMLInputElement>(
            'input[name="event_start_datetime_local"]',
          );
          const hiddenInput = form.querySelector<HTMLInputElement>(
            'input[name="event_start_datetime"]',
          );
          if (localInput && hiddenInput) {
            // Convert local datetime to ISO-8601 with +07:00 offset
            hiddenInput.value = toIso8601WithOffset(localInput.value);
          }
        }}
      >
        {pending ? 'Saving...' : 'Save'}
      </button>

      {state && (
        <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}

function toDatetimeLocalValue(iso: string): string {
  const date = new Date(iso);
  // Format to Vietnam time (UTC+7)
  const vn = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  return vn.toISOString().slice(0, 16);
}

function toIso8601WithOffset(localValue: string): string {
  return `${localValue}:00+07:00`;
}

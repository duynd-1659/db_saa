'use client';

import { useActionState, useEffect, useRef } from 'react';
import { updateMyRole } from '@/services/admin-service';

interface RoleFormProps {
  currentRole: string;
  email: string;
}

type FormState = { message: string; success: boolean } | null;

async function handleSubmit(_prev: FormState, formData: FormData): Promise<FormState> {
  const result = await updateMyRole(formData);
  if (result.success) {
    return { message: 'Role updated!', success: true };
  }
  return { message: result.error, success: false };
}

export function RoleForm({ currentRole, email }: RoleFormProps): React.ReactElement {
  const [state, action, pending] = useActionState(handleSubmit, null);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.value = currentRole;
    }
  }, [currentRole]);

  return (
    <form action={action} className="flex flex-col gap-4 max-w-md">
      <p className="text-sm text-gray-600">
        Logged in as <span className="font-medium">{email}</span>
      </p>
      <p className="text-sm text-gray-600">
        Current role: <span className="font-semibold">{currentRole}</span>
      </p>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">New Role</span>
        <select
          ref={selectRef}
          name="role"
          defaultValue={currentRole}
          className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? 'Saving...' : 'Update Role'}
      </button>

      {state && (
        <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}

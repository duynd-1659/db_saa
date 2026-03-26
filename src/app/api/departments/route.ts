import { NextResponse } from 'next/server';
import { fetchDepartments } from '@/services/department-service';

export async function GET(): Promise<NextResponse> {
  try {
    const departments = await fetchDepartments();
    return NextResponse.json({ departments });
  } catch (err) {
    console.error('[GET /api/departments] Unexpected error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

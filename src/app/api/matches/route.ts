import { NextRequest, NextResponse } from 'next/server';
import { getRequestById, getProviders } from '@/lib/data';
import { matchProviders } from '@/lib/matching';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { requestId } = body as { requestId: string };

  if (!requestId) {
    return NextResponse.json({ error: 'requestId is required' }, { status: 400 });
  }

  const request = getRequestById(requestId);
  if (!request) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 });
  }

  const providers = getProviders();
  const matches = matchProviders(request, providers);

  return NextResponse.json(matches);
}

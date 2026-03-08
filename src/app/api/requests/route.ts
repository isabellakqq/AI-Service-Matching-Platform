import { NextRequest, NextResponse } from 'next/server';
import { getRequests, addRequest } from '@/lib/data';
import { ServiceRequest } from '@/lib/types';
import { randomUUID } from 'crypto';

export async function GET() {
  return NextResponse.json(getRequests());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const request: ServiceRequest = {
    id: randomUUID(),
    clientName: body.clientName,
    email: body.email,
    title: body.title,
    description: body.description,
    category: body.category,
    budget: Number(body.budget),
    timeline: body.timeline,
    requiredSkills: body.requiredSkills ?? [],
    createdAt: new Date().toISOString(),
  };
  addRequest(request);
  return NextResponse.json(request, { status: 201 });
}

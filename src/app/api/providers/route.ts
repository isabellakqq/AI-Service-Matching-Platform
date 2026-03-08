import { NextRequest, NextResponse } from 'next/server';
import { getProviders, addProvider } from '@/lib/data';
import { ServiceProvider } from '@/lib/types';
import { randomUUID } from 'crypto';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  let providers = getProviders();
  if (category) {
    providers = providers.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }
  return NextResponse.json(providers);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const provider: ServiceProvider = {
    id: randomUUID(),
    name: body.name,
    email: body.email,
    category: body.category,
    skills: body.skills ?? [],
    description: body.description,
    hourlyRate: Number(body.hourlyRate),
    availability: body.availability,
    rating: 0,
    completedProjects: 0,
    createdAt: new Date().toISOString(),
  };
  addProvider(provider);
  return NextResponse.json(provider, { status: 201 });
}

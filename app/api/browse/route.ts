import { NextRequest, NextResponse } from 'next/server';
import { createShelbyClient, readRegistry } from '../../../src/lib/shelby';

export async function GET(req: NextRequest) {
  const owner = req.nextUrl.searchParams.get('owner');
  if (!owner) {
    return NextResponse.json({ error: 'Missing owner address' }, { status: 400 });
  }
  try {
    const client = createShelbyClient();
    const registry = await readRegistry(client, owner);
    return NextResponse.json(registry);
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Failed to read registry' }, { status: 500 });
  }
}

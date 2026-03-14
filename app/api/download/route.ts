import { NextRequest, NextResponse } from 'next/server';
import { createShelbyClient, downloadDataset } from '../../../src/lib/shelby';

export async function GET(req: NextRequest) {
  const account = req.nextUrl.searchParams.get('account');
  const blobName = req.nextUrl.searchParams.get('blobName');

  if (!account || !blobName) {
    return NextResponse.json({ error: 'Missing account or blobName' }, { status: 400 });
  }

  try {
    const client = createShelbyClient();
    const dataset = await downloadDataset(client, account, blobName);
    return NextResponse.json(dataset);
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Download failed' }, { status: 500 });
  }
}

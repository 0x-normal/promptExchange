import { NextRequest, NextResponse } from 'next/server';
import { Account, Ed25519PrivateKey, PrivateKey, PrivateKeyVariants } from '@aptos-labs/ts-sdk';
import { createShelbyClient, fundWithAPT, fundWithShelbyUSD } from '../../../src/lib/shelby';

export async function POST(req: NextRequest) {
  try {
    const { privateKey } = await req.json();
    if (!privateKey) return NextResponse.json({ error: 'Missing privateKey' }, { status: 400 });

    const key = new Ed25519PrivateKey(
      PrivateKey.formatPrivateKey(privateKey, PrivateKeyVariants.Ed25519)
    );
    const account = Account.fromPrivateKey({ privateKey: key });
    const address = account.accountAddress.toString();

    const client = createShelbyClient();
    await fundWithAPT(client, address, 100_000_000_000);
    await fundWithShelbyUSD(client, address, 10_000_000);

    return NextResponse.json({ success: true, address });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Funding failed' }, { status: 500 });
  }
}

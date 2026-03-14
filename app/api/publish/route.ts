import { NextRequest, NextResponse } from 'next/server';
import { Account, Ed25519PrivateKey, PrivateKey, PrivateKeyVariants } from '@aptos-labs/ts-sdk';
import {
  createShelbyClient,
  uploadDataset,
  updateRegistry,
} from '../../../src/lib/shelby';
import type { DatasetMetadata, PromptSample, RegistryEntry } from '../../../src/types/dataset';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { privateKey, metadata, prompts } = body as {
      privateKey: string;
      metadata: DatasetMetadata;
      prompts: PromptSample[];
    };

    if (!privateKey) return NextResponse.json({ error: 'Missing privateKey' }, { status: 400 });
    if (!metadata?.name) return NextResponse.json({ error: 'Missing dataset metadata' }, { status: 400 });
    if (!prompts?.length) return NextResponse.json({ error: 'No prompts provided' }, { status: 400 });

    // Load account from private key
    const key = new Ed25519PrivateKey(
      PrivateKey.formatPrivateKey(privateKey, PrivateKeyVariants.Ed25519)
    );
    const account = Account.fromPrivateKey({ privateKey: key });

    const client = createShelbyClient();

    // Upload dataset blob to Shelby
    const { blobName, accountAddress } = await uploadDataset(
      client,
      account,
      { ...metadata, creatorAddress: accountAddress ?? account.accountAddress.toString() },
      prompts
    );

    // Update registry blob on Shelby
    const entry: RegistryEntry = {
      blobName,
      accountAddress,
      uploadedAt: new Date().toISOString(),
      metadata: {
        ...metadata,
        blobName,
        accountAddress,
        creatorAddress: accountAddress,
        promptCount: prompts.length,
        preview: prompts.slice(0, 3),
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    };

    await updateRegistry(client, account, entry);

    return NextResponse.json({
      success: true,
      blobName,
      accountAddress,
      explorerUrl: `https://explorer.shelby.xyz/testnet/account/${accountAddress}`,
    });
  } catch (err: any) {
    console.error('[publish]', err);
    return NextResponse.json({ error: err.message ?? 'Upload failed' }, { status: 500 });
  }
}

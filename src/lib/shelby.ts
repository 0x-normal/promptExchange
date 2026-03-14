import { ShelbyNodeClient } from '@shelby-protocol/sdk/node';
import { Account, Ed25519PrivateKey, Network, PrivateKey, PrivateKeyVariants } from '@aptos-labs/ts-sdk';
import type { DatasetMetadata, PromptSample, Registry, RegistryEntry, ShelbyDatasetBlob } from '../types/dataset.js';

// ── Network config ────────────────────────────────────────────────────────────

const NETWORK = (process.env.SHELBY_NETWORK as 'testnet' | 'shelbynet') ?? 'testnet';
const RPC_URL =
  NETWORK === 'testnet'
    ? 'https://api.testnet.shelby.xyz/shelby'
    : 'https://api.shelbynet.shelby.xyz/shelby';

const APTOS_NETWORK = NETWORK === 'testnet' ? Network.TESTNET : ('shelbynet' as Network);

// Registry blob stores the index of all published datasets
export const REGISTRY_BLOB_NAME = 'prompt-exchange/registry.json';

// 30-day expiry in microseconds
const THIRTY_DAYS_MICROS = 30 * 24 * 60 * 60 * 1000 * 1000;

// ── Client factory ────────────────────────────────────────────────────────────

export function createShelbyClient(): ShelbyNodeClient {
  return new ShelbyNodeClient({
    network: APTOS_NETWORK,
    shelby: {
      rpc: { baseUrl: RPC_URL },
    },
  });
}

export function loadAccount(): Account {
  const privKey = process.env.APTOS_PRIVATE_KEY;
  if (!privKey) {
    throw new Error('APTOS_PRIVATE_KEY not set in environment');
  }
  const key = new Ed25519PrivateKey(
    PrivateKey.formatPrivateKey(privKey, PrivateKeyVariants.Ed25519)
  );
  return Account.fromPrivateKey({ privateKey: key });
}

// ── Upload a dataset ──────────────────────────────────────────────────────────

export async function uploadDataset(
  client: ShelbyNodeClient,
  account: Account,
  metadata: DatasetMetadata,
  prompts: PromptSample[]
): Promise<{ blobName: string; accountAddress: string }> {
  const slug = metadata.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const blobName = `prompt-exchange/datasets/${slug}-${Date.now()}.json`;

  const blob: ShelbyDatasetBlob = {
    version: '1.0',
    metadata: {
      ...metadata,
      blobName,
      accountAddress: account.accountAddress.toString(),
      createdAt: new Date().toISOString(),
    },
    prompts,
  };

  const data = Buffer.from(JSON.stringify(blob, null, 2));

  console.log(`\n📤 Uploading dataset "${metadata.name}" to Shelby...`);
  console.log(`   Blob name : ${blobName}`);
  console.log(`   Size      : ${(data.length / 1024).toFixed(1)} KB`);
  console.log(`   Network   : ${NETWORK}`);
  console.log(`   Account   : ${account.accountAddress.toString()}`);

  const expirationMicros = Date.now() * 1000 + THIRTY_DAYS_MICROS;

  await client.upload({
    blobData: new Uint8Array(data),
    signer: account,
    blobName,
    expirationMicros,
  });

  console.log(`✅ Dataset uploaded successfully!`);
  console.log(`   Explorer  : https://explorer.shelby.xyz/${NETWORK}/account/${account.accountAddress}`);

  return {
    blobName,
    accountAddress: account.accountAddress.toString(),
  };
}

// ── Download a dataset ────────────────────────────────────────────────────────

export async function downloadDataset(
  client: ShelbyNodeClient,
  accountAddress: string,
  blobName: string
): Promise<ShelbyDatasetBlob> {
  console.log(`\n📥 Downloading dataset from Shelby...`);
  console.log(`   Account   : ${accountAddress}`);
  console.log(`   Blob name : ${blobName}`);

  const blob = await client.download({ account: accountAddress, blobName });
  const text = Buffer.from(blob.data).toString('utf-8');
  const parsed = JSON.parse(text) as ShelbyDatasetBlob;

  console.log(`✅ Downloaded "${parsed.metadata.name}" (${parsed.prompts.length} prompts)`);
  return parsed;
}

// ── Registry: read ────────────────────────────────────────────────────────────

export async function readRegistry(
  client: ShelbyNodeClient,
  registryOwner: string
): Promise<Registry> {
  try {
    const blob = await client.download({
      account: registryOwner,
      blobName: REGISTRY_BLOB_NAME,
    });
    const text = Buffer.from(blob.data).toString('utf-8');
    return JSON.parse(text) as Registry;
  } catch {
    // Registry doesn't exist yet — return empty
    return {
      version: '1.0',
      updatedAt: new Date().toISOString(),
      entries: [],
    };
  }
}

// ── Registry: add entry and re-upload ────────────────────────────────────────

export async function updateRegistry(
  client: ShelbyNodeClient,
  account: Account,
  newEntry: RegistryEntry
): Promise<void> {
  const registry = await readRegistry(client, account.accountAddress.toString());

  // Remove any existing entry with the same blobName before adding the new one
  registry.entries = registry.entries.filter((e) => e.blobName !== newEntry.blobName);
  registry.entries.unshift(newEntry);
  registry.updatedAt = new Date().toISOString();

  const data = Buffer.from(JSON.stringify(registry, null, 2));
  const expirationMicros = Date.now() * 1000 + THIRTY_DAYS_MICROS;

  console.log(`\n🗂  Updating registry on Shelby...`);
  console.log(`   Entries   : ${registry.entries.length}`);

  await client.upload({
    blobData: new Uint8Array(data),
    signer: account,
    blobName: REGISTRY_BLOB_NAME,
    expirationMicros,
  });

  console.log(`✅ Registry updated at blob: ${REGISTRY_BLOB_NAME}`);
}

// ── Fund account helpers ──────────────────────────────────────────────────────

export async function fundWithAPT(
  client: ShelbyNodeClient,
  address: string,
  amount = 100_000_000_000
): Promise<void> {
  console.log(`\n💧 Funding ${address} with APT...`);
  const hash = await client.fundAccountWithAPT({ address, amount });
  console.log(`✅ APT funded. Tx: ${hash}`);
}

export async function fundWithShelbyUSD(
  client: ShelbyNodeClient,
  address: string,
  amount = 10_000_000
): Promise<void> {
  console.log(`\n💧 Funding ${address} with ShelbyUSD...`);
  const hash = await client.fundAccountWithShelbyUSD({ address, amount });
  console.log(`✅ ShelbyUSD funded. Tx: ${hash}`);
}

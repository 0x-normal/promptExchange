/**
 * publish.ts — Upload a prompt dataset to Shelby and register it in the exchange registry.
 *
 * Usage:
 *   npx tsx src/scripts/publish.ts
 *
 * Env:
 *   APTOS_PRIVATE_KEY=ed25519-priv-0x...
 *   SHELBY_NETWORK=testnet   (or shelbynet)
 */

import 'dotenv/config';
import {
  createShelbyClient,
  loadAccount,
  uploadDataset,
  updateRegistry,
  fundWithAPT,
  fundWithShelbyUSD,
} from '../lib/shelby.js';
import type { DatasetMetadata, PromptSample, RegistryEntry } from '../types/dataset.js';

// ── Sample dataset: Arabic instruction-following ─────────────────────────────
// Replace this with your real dataset loaded from a file

const metadata: DatasetMetadata = {
  name: 'ArabicInstruct-Demo',
  description:
    'A small demo dataset of Arabic instruction-following pairs. ' +
    'Covers MSA and Darija dialects across everyday topics.',
  category: 'multilingual',
  tags: ['arabic', 'instruction', 'darija', 'MSA'],
  promptCount: 5,
  qualityScore: 5,
  price: 0, // free
  creatorAddress: '', // filled in from account
  createdAt: '',      // filled in on upload
  expiresAt: '',
};

const prompts: PromptSample[] = [
  {
    instruction: 'اشرح مفهوم الذكاء الاصطناعي بأسلوب بسيط.',
    output:
      'الذكاء الاصطناعي هو فرع من علوم الحاسوب يهدف إلى بناء أنظمة قادرة على التفكير والتعلم كالبشر. ' +
      'تُستخدم هذه التقنية في تطبيقات مثل المساعدات الصوتية وتشخيص الأمراض والسيارات ذاتية القيادة.',
  },
  {
    instruction: 'Write a Python function that reverses a string.',
    output: 'def reverse_string(s: str) -> str:\n    return s[::-1]',
  },
  {
    instruction: 'Explain what blockchain is in one sentence.',
    output:
      'A blockchain is a distributed ledger that records transactions in immutable, ' +
      'cryptographically linked blocks replicated across a network of nodes.',
  },
  {
    instruction: 'ما هي عاصمة المغرب؟',
    output: 'عاصمة المغرب هي مدينة الرباط.',
  },
  {
    instruction: 'Give me three tips for writing clean code.',
    output:
      '1. Use meaningful variable and function names.\n' +
      '2. Keep functions small and focused on a single task.\n' +
      '3. Write comments that explain *why*, not *what*.',
  },
];

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const client = createShelbyClient();
  const account = loadAccount();

  console.log('\n🚀 Prompt Dataset Exchange — Publisher');
  console.log('═'.repeat(50));
  console.log(`Account  : ${account.accountAddress}`);
  console.log(`Dataset  : ${metadata.name}`);
  console.log(`Prompts  : ${prompts.length}`);
  console.log(`Category : ${metadata.category}`);
  console.log(`Price    : ${metadata.price === 0 ? 'Free' : `$${metadata.price} ShelbyUSD`}`);
  console.log('═'.repeat(50));

  // Step 1 — Fund account (only needed first time on testnet)
  if (process.env.AUTO_FUND === 'true') {
    await fundWithAPT(client, account.accountAddress.toString());
    await fundWithShelbyUSD(client, account.accountAddress.toString());
  }

  // Step 2 — Upload the dataset blob to Shelby
  const { blobName, accountAddress } = await uploadDataset(
    client,
    account,
    { ...metadata, creatorAddress: account.accountAddress.toString() },
    prompts
  );

  // Step 3 — Register the dataset in the on-chain registry
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

  // Step 4 — Print summary
  console.log('\n🎉 Published successfully!\n');
  console.log(`  Dataset blob : ${blobName}`);
  console.log(`  Registry     : prompt-exchange/registry.json`);
  console.log(`  Explorer     : https://explorer.shelby.xyz/testnet/account/${accountAddress}`);
  console.log(`\n  Download cmd :`);
  console.log(`  npx tsx src/scripts/download.ts ${accountAddress} "${blobName}"`);
}

main().catch((err) => {
  console.error('\n❌ Error:', err.message ?? err);
  process.exit(1);
});

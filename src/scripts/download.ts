/**
 * download.ts — Download and inspect a dataset blob from Shelby.
 *
 * Usage:
 *   npx tsx src/scripts/download.ts <accountAddress> <blobName> [outputFile]
 *
 * Example:
 *   npx tsx src/scripts/download.ts 0xfcb...a51c "prompt-exchange/datasets/arabicinstruct-demo-1742000000000.json"
 *   npx tsx src/scripts/download.ts 0xfcb...a51c "prompt-exchange/datasets/arabicinstruct-demo-1742000000000.json" ./output.json
 */

import 'dotenv/config';
import { writeFileSync } from 'fs';
import { createShelbyClient, downloadDataset } from '../lib/shelby.js';

async function main() {
  const [,, accountAddress, blobName, outputFile] = process.argv;

  if (!accountAddress || !blobName) {
    console.error('Usage: npx tsx src/scripts/download.ts <accountAddress> <blobName> [outputFile]');
    process.exit(1);
  }

  const client = createShelbyClient();

  console.log('\n📥 Prompt Dataset Exchange — Downloader');
  console.log('═'.repeat(60));

  const dataset = await downloadDataset(client, accountAddress, blobName);
  const m = dataset.metadata;

  console.log('\n📊 Dataset Info');
  console.log('─'.repeat(40));
  console.log(`Name      : ${m.name}`);
  console.log(`Category  : ${m.category}`);
  console.log(`Prompts   : ${dataset.prompts.length.toLocaleString()}`);
  console.log(`Quality   : ${'★'.repeat(m.qualityScore)}${'☆'.repeat(5 - m.qualityScore)} (${m.qualityScore}/5)`);
  console.log(`Price     : ${m.price === 0 ? 'FREE' : `$${m.price} ShelbyUSD`}`);
  console.log(`Tags      : ${m.tags.join(', ')}`);
  console.log(`Creator   : ${m.creatorAddress}`);
  console.log(`Created   : ${new Date(m.createdAt).toLocaleString()}`);
  console.log(`Expires   : ${new Date(m.expiresAt).toLocaleString()}`);

  console.log('\n🔍 Sample Prompts (first 3)');
  console.log('─'.repeat(40));
  dataset.prompts.slice(0, 3).forEach((p, i) => {
    console.log(`\n[${i + 1}] Instruction:`);
    console.log(`    ${p.instruction}`);
    if (p.input) console.log(`    Input: ${p.input}`);
    console.log(`    Output:`);
    console.log(`    ${p.output.replace(/\n/g, '\n    ')}`);
  });

  // Optionally save to file
  if (outputFile) {
    const json = JSON.stringify(dataset, null, 2);
    writeFileSync(outputFile, json);
    console.log(`\n💾 Saved to: ${outputFile}`);
    console.log(`   Size    : ${(json.length / 1024).toFixed(1)} KB`);
  }

  console.log(`\n✅ Done. ${dataset.prompts.length} prompts downloaded from Shelby.\n`);
}

main().catch((err) => {
  console.error('\n❌ Error:', err.message ?? err);
  process.exit(1);
});

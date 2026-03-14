/**
 * browse.ts — Read the Prompt Exchange registry from Shelby and display all datasets.
 *
 * Usage:
 *   npx tsx src/scripts/browse.ts <registryOwnerAddress>
 *
 * Example:
 *   npx tsx src/scripts/browse.ts 0xfcba...a51c
 */

import 'dotenv/config';
import { createShelbyClient, readRegistry } from '../lib/shelby.js';

async function main() {
  const registryOwner = process.argv[2];
  if (!registryOwner) {
    console.error('Usage: npx tsx src/scripts/browse.ts <registryOwnerAddress>');
    process.exit(1);
  }

  const client = createShelbyClient();

  console.log('\n📦 Prompt Dataset Exchange — Registry Browser');
  console.log('═'.repeat(60));
  console.log(`Registry owner : ${registryOwner}`);

  const registry = await readRegistry(client, registryOwner);

  if (registry.entries.length === 0) {
    console.log('\nNo datasets published yet.\n');
    return;
  }

  console.log(`Updated at     : ${registry.updatedAt}`);
  console.log(`Total datasets : ${registry.entries.length}`);
  console.log('═'.repeat(60));

  for (const [i, entry] of registry.entries.entries()) {
    const m = entry.metadata;
    const stars = '★'.repeat(m.qualityScore) + '☆'.repeat(5 - m.qualityScore);
    const price = m.price === 0 ? 'FREE' : `$${m.price} ShelbyUSD`;

    console.log(`\n[${i + 1}] ${m.name}`);
    console.log(`    Category  : ${m.category}`);
    console.log(`    Prompts   : ${m.promptCount.toLocaleString()}`);
    console.log(`    Quality   : ${stars} (${m.qualityScore}/5)`);
    console.log(`    Price     : ${price}`);
    console.log(`    Tags      : ${m.tags.join(', ')}`);
    console.log(`    Creator   : ${m.creatorAddress}`);
    console.log(`    Blob      : ${entry.blobName}`);
    console.log(`    Uploaded  : ${new Date(entry.uploadedAt).toLocaleString()}`);

    if (m.preview && m.preview.length > 0) {
      console.log(`\n    Preview (first prompt):`);
      const p = m.preview[0];
      const instr = p.instruction.length > 80 ? p.instruction.slice(0, 77) + '...' : p.instruction;
      const out = p.output.length > 80 ? p.output.slice(0, 77) + '...' : p.output;
      console.log(`      Instruction: ${instr}`);
      console.log(`      Output     : ${out}`);
    }

    console.log(`\n    Download   :`);
    console.log(`    npx tsx src/scripts/download.ts ${entry.accountAddress} "${entry.blobName}"`);
    console.log('    ' + '─'.repeat(56));
  }
  console.log('');
}

main().catch((err) => {
  console.error('\n❌ Error:', err.message ?? err);
  process.exit(1);
});

/**
 * fund.ts — Fund your Shelby testnet account with APT and ShelbyUSD.
 *
 * Usage:
 *   npx tsx src/scripts/fund.ts
 *
 * Env:
 *   APTOS_PRIVATE_KEY=ed25519-priv-0x...
 */

import 'dotenv/config';
import { createShelbyClient, loadAccount, fundWithAPT, fundWithShelbyUSD } from '../lib/shelby.js';

async function main() {
  const client = createShelbyClient();
  const account = loadAccount();

  console.log('\n💧 Funding account on Shelby Testnet');
  console.log('═'.repeat(50));
  console.log(`Account : ${account.accountAddress}`);

  await fundWithAPT(client, account.accountAddress.toString(), 100_000_000_000);
  await fundWithShelbyUSD(client, account.accountAddress.toString(), 10_000_000);

  console.log('\n✅ Account funded. You can now publish datasets.\n');
}

main().catch((err) => {
  console.error('\n❌ Error:', err.message ?? err);
  process.exit(1);
});

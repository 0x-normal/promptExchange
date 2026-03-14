# Prompt Dataset Exchange 🧠

> A decentralized marketplace for prompt datasets — built on [Shelby Protocol](https://shelby.xyz).

Datasets are stored as **blobs on Shelby**. The registry index is itself a blob. No centralized backend, no database, no server.

---

## How it works

```
Publisher                      Shelby Network                Consumer
─────────                      ──────────────                ────────
publish.ts                     
  │                            
  ├─ encode dataset → JSON      
  ├─ client.upload(blob)  ──►  blob stored on Shelby        
  ├─ readRegistry()       ──►  fetch registry.json          
  ├─ registry.entries.push()   
  └─ client.upload(registry) ► registry.json updated        
                                                              browse.ts
                                                                │
                                                                ├─ readRegistry() ◄── fetch registry.json
                                                                ├─ display all entries
                                                                └─ download.ts ◄────── fetch dataset blob
```

Everything lives on Shelby:
- `prompt-exchange/registry.json` — the index of all datasets
- `prompt-exchange/datasets/<name>-<timestamp>.json` — each individual dataset

---

## Quick start

### 1. Prerequisites

```bash
# Install Shelby CLI
npm i -g @shelby-protocol/cli

# Create account
shelby init

# Get your private key
shelby account list
```

### 2. Install

```bash
git clone https://github.com/yourname/prompt-exchange
cd prompt-exchange
npm install
cp .env.example .env
# Edit .env and set APTOS_PRIVATE_KEY
```

### 3. Fund your account (testnet only)

```bash
npm run fund
# OR set AUTO_FUND=true in .env and it runs automatically on publish
```

### 4. Publish a dataset

Edit the dataset in `src/scripts/publish.ts` then:

```bash
npm run publish
```

Output:
```
🚀 Prompt Dataset Exchange — Publisher
══════════════════════════════════════════════════
Account  : 0xfcba...a51c
Dataset  : ArabicInstruct-Demo
Prompts  : 5
Category : multilingual
Price    : Free
══════════════════════════════════════════════════

📤 Uploading dataset "ArabicInstruct-Demo" to Shelby...
   Blob name : prompt-exchange/datasets/arabicinstruct-demo-1742123456789.json
   Size      : 2.3 KB
   Network   : testnet
   Account   : 0xfcba...a51c
✅ Dataset uploaded successfully!
   Explorer  : https://explorer.shelby.xyz/testnet/account/0xfcba...a51c

🗂  Updating registry on Shelby...
   Entries   : 1
✅ Registry updated at blob: prompt-exchange/registry.json

🎉 Published successfully!

  Dataset blob : prompt-exchange/datasets/arabicinstruct-demo-1742123456789.json
  Registry     : prompt-exchange/registry.json
  Explorer     : https://explorer.shelby.xyz/testnet/account/0xfcba...a51c
```

### 5. Browse the exchange

```bash
npm run browse 0xfcba...a51c
```

Output:
```
📦 Prompt Dataset Exchange — Registry Browser
════════════════════════════════════════════════════════════
Registry owner : 0xfcba...a51c
Updated at     : 2026-03-14T10:23:00.000Z
Total datasets : 1
════════════════════════════════════════════════════════════

[1] ArabicInstruct-Demo
    Category  : multilingual
    Prompts   : 5
    Quality   : ★★★★★ (5/5)
    Price     : FREE
    Tags      : arabic, instruction, darija, MSA
    Creator   : 0xfcba...a51c
    Blob      : prompt-exchange/datasets/arabicinstruct-demo-1742123456789.json
    Uploaded  : 3/14/2026

    Preview (first prompt):
      Instruction: اشرح مفهوم الذكاء الاصطناعي بأسلوب بسيط.
      Output     : الذكاء الاصطناعي هو فرع من علوم الحاسوب يهدف إلى بناء...

    Download   :
    npx tsx src/scripts/download.ts 0xfcba...a51c "prompt-exchange/datasets/..."
```

### 6. Download a dataset

```bash
npm run download 0xfcba...a51c "prompt-exchange/datasets/arabicinstruct-demo-1742123456789.json"

# Save to file
npm run download 0xfcba...a51c "prompt-exchange/datasets/arabicinstruct-demo-1742123456789.json" ./my-dataset.json
```

---

## Project structure

```
prompt-exchange/
├── src/
│   ├── lib/
│   │   └── shelby.ts          ← Shelby SDK wrapper (upload, download, registry)
│   ├── types/
│   │   └── dataset.ts         ← TypeScript types for datasets
│   └── scripts/
│       ├── fund.ts            ← Fund testnet account
│       ├── publish.ts         ← Upload a dataset + update registry
│       ├── browse.ts          ← Read registry and list all datasets
│       └── download.ts        ← Download and inspect a dataset blob
├── .env.example
├── tsconfig.json
└── package.json
```

---

## Data formats

### Dataset blob (stored on Shelby)
```json
{
  "version": "1.0",
  "metadata": {
    "name": "ArabicInstruct-Demo",
    "category": "multilingual",
    "promptCount": 5,
    "qualityScore": 5,
    "price": 0,
    "tags": ["arabic", "instruction"],
    "creatorAddress": "0xfcba...a51c",
    "blobName": "prompt-exchange/datasets/arabicinstruct-demo-1742123456789.json",
    "createdAt": "2026-03-14T10:23:00.000Z"
  },
  "prompts": [
    {
      "instruction": "اشرح مفهوم الذكاء الاصطناعي بأسلوب بسيط.",
      "output": "الذكاء الاصطناعي هو فرع من علوم الحاسوب..."
    }
  ]
}
```

### Registry blob (stored on Shelby at `prompt-exchange/registry.json`)
```json
{
  "version": "1.0",
  "updatedAt": "2026-03-14T10:23:00.000Z",
  "entries": [
    {
      "blobName": "prompt-exchange/datasets/arabicinstruct-demo-1742123456789.json",
      "accountAddress": "0xfcba...a51c",
      "uploadedAt": "2026-03-14T10:23:00.000Z",
      "metadata": { ... }
    }
  ]
}
```

---

## Roadmap

- [ ] Multi-publisher support (federated registries)
- [ ] ShelbyUSD payment flow for paid datasets
- [ ] CLI: `prompt-exchange publish ./my-dataset.jsonl`
- [ ] Web UI that reads registry and renders datasets
- [ ] Quality verification using AI scoring before publish
- [ ] Dataset versioning (v1, v2 of same dataset)

---

## Built with

- [`@shelby-protocol/sdk`](https://docs.shelby.xyz/sdks/typescript) — real blob storage
- [`@aptos-labs/ts-sdk`](https://github.com/aptos-labs/aptos-ts-sdk) — Aptos account management
- [Shelby Testnet](https://explorer.shelby.xyz) — decentralized storage network

---

MIT — built by [@isanoxel](https://twitter.com/isanoxel)

export type DatasetCategory =
  | 'reasoning'
  | 'coding'
  | 'instruction'
  | 'roleplay'
  | 'multilingual'
  | 'math';

export interface DatasetMetadata {
  // Core info
  name: string;
  description: string;
  category: DatasetCategory;
  tags: string[];

  // Size & quality
  promptCount: number;
  qualityScore: number; // 1–5

  // Pricing (ShelbyUSD micro units, 0 = free)
  price: number;

  // Authorship
  creatorAddress: string;
  creatorName?: string;

  // Storage — set after upload
  blobName?: string;
  accountAddress?: string;

  // Timestamps
  createdAt: string; // ISO string
  expiresAt: string; // ISO string

  // Optional preview (first 3 prompts)
  preview?: PromptSample[];
}

export interface PromptSample {
  instruction: string;
  input?: string;
  output: string;
}

export interface PromptDataset {
  metadata: DatasetMetadata;
  prompts: PromptSample[];
}

// What gets serialized and stored as a blob on Shelby
export interface ShelbyDatasetBlob {
  version: '1.0';
  metadata: DatasetMetadata;
  prompts: PromptSample[];
}

// What gets stored in the registry index blob
export interface RegistryEntry {
  blobName: string;        // path on Shelby e.g. "datasets/reasoning-50k"
  accountAddress: string;  // owner's Aptos address
  metadata: DatasetMetadata;
  uploadedAt: string;
}

export interface Registry {
  version: '1.0';
  updatedAt: string;
  entries: RegistryEntry[];
}

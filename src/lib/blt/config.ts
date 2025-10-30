import { z } from 'zod';
import { BLTConfig } from './types';

export const DEFAULT_BLT_CONFIG: BLTConfig = {
  dModel: 768,
  numHeads: 12,
  numLayers: 12,
  ffnDim: 3072,
  dropout: 0.1,
  maxSeqLength: 4096,
  vocabSize: 50000,
  patchSize: {
    min: 4,
    max: 512
  },
  useMixedPrecision: true,
  useXLA: true,
  enableMemoryEfficientAttention: true
};

export const BLTConfigSchema = z.object({
  dModel: z.number().int().positive(),
  numHeads: z.number().int().positive(),
  numLayers: z.number().int().positive(),
  ffnDim: z.number().int().positive(),
  dropout: z.number().min(0).max(1),
  maxSeqLength: z.number().int().positive(),
  vocabSize: z.number().int().positive(),
  patchSize: z.object({
    min: z.number().int().positive(),
    max: z.number().int().positive()
  }),
  useMixedPrecision: z.boolean(),
  useXLA: z.boolean(),
  enableMemoryEfficientAttention: z.boolean()
}).partial();

export function validateBLTConfig(config: unknown): BLTConfig {
  return BLTConfigSchema.parse({
    ...DEFAULT_BLT_CONFIG,
    ...(config || {})
  }) as BLTConfig;
}

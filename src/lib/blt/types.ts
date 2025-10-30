import { Tensor } from '@tensorflow/tfjs';

export interface Patch {
  bytes: Uint8Array;
  start: number;
  end: number;
  entropy: number;
}

export interface BLTConfig {
  dModel: number;
  numHeads: number;
  numLayers: number;
  ffnDim: number;
  dropout: number;
  maxSeqLength: number;
  vocabSize: number;
  patchSize: {
    min: number;
    max: number;
  };
  useMixedPrecision: boolean;
  useXLA: boolean;
  enableMemoryEfficientAttention: boolean;
}

export interface BLTProcessResult {
  output: string | Uint8Array;
  patches: Patch[];
  metrics: {
    processingTimeMs: number;
    memoryUsageMb: number;
    patchCount: number;
    avgPatchSize: number;
  };
}

export interface BLTModel {
  predict: (inputs: any) => Promise<any>;
  dispose?: () => void;
}

import { LatentTransformer } from '../core/latent_transformer';

describe('LatentTransformer', () => {
  let transformer: LatentTransformer;

  beforeAll(() => {
    // Initialize with test configuration
    transformer = new LatentTransformer({
      dModel: 64,  // Smaller model for testing
      numHeads: 4,
      numLayers: 2,
      ffnDim: 128,
      maxSeqLength: 512,
      patchSize: {
        min: 4,
        max: 32
      }
    });
  });

  afterAll(async () => {
    // Clean up
    await transformer.dispose();
  });

  it('should process basic text', async () => {
    const text = 'Hello, world!';
    const result = await transformer.process(text);
    
    expect(result).toBeDefined();
    expect(result.output).toBeDefined();
    expect(typeof result.output).toBe('string');
    expect(result.patches.length).toBeGreaterThan(0);
    expect(result.metrics.processingTimeMs).toBeGreaterThan(0);
  });

  it('should handle empty input', async () => {
    const result = await transformer.process('');
    expect(result.output).toBe('');
    expect(result.patches).toHaveLength(0);
  });

  it('should process binary data', async () => {
    const binaryData = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]); // 'Hello' in binary
    const result = await transformer.process(binaryData);
    
    expect(result.output).toBeInstanceOf(Uint8Array);
    expect((result.output as Uint8Array).length).toBeGreaterThan(0);
  });

  it('should handle large text', async () => {
    const largeText = 'A'.repeat(10000); // 10KB of text
    const result = await transformer.process(largeText);
    
    expect(result.output.length).toBe(largeText.length);
    expect(result.patches.length).toBeGreaterThan(1); // Should have multiple patches
  });

  it('should respect patch size limits', async () => {
    const text = 'This is a test string that should be split into multiple patches';
    const result = await transformer.process(text);
    
    // Check that no patch exceeds the maximum size
    const maxPatchSize = result.patches.reduce(
      (max, patch) => Math.max(max, patch.bytes.length), 0
    );
    
    expect(maxPatchSize).toBeLessThanOrEqual(32); // max patch size from config
    
    // Check that small patches are not split further
    const minPatchSize = result.patches.reduce(
      (min, patch) => Math.min(min, patch.bytes.length), Infinity
    );
    
    expect(minPatchSize).toBeGreaterThanOrEqual(4); // min patch size from config
  });
});

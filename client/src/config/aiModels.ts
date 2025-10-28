/**
 * AI Models Configuration
 * Updated: October 28, 2025
 * 
 * Latest model versions as of October 2025
 */

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  version: string;
  type: 'text' | 'multimodal' | 'vision' | 'code';
  contextWindow: number;
  costPer1MTokens: {
    input: number;
    output: number;
  };
  capabilities: string[];
  status: 'active' | 'deprecated' | 'beta';
  releaseDate: string;
  deprecationDate?: string;
}

export const AI_MODELS: AIModel[] = [
  // OpenAI Models
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    version: '2025-10',
    type: 'multimodal',
    contextWindow: 128000,
    costPer1MTokens: { input: 2.50, output: 10.00 },
    capabilities: ['text', 'vision', 'function-calling', 'json-mode', 'streaming'],
    status: 'active',
    releaseDate: '2024-05-13'
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    version: '2025-10',
    type: 'multimodal',
    contextWindow: 128000,
    costPer1MTokens: { input: 0.15, output: 0.60 },
    capabilities: ['text', 'vision', 'function-calling', 'json-mode', 'streaming'],
    status: 'active',
    releaseDate: '2024-07-18'
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    version: '2024-04-09',
    type: 'multimodal',
    contextWindow: 128000,
    costPer1MTokens: { input: 10.00, output: 30.00 },
    capabilities: ['text', 'vision', 'function-calling', 'json-mode'],
    status: 'active',
    releaseDate: '2024-04-09'
  },

  // Anthropic Claude Models
  {
    id: 'claude-opus-4.1',
    name: 'Claude Opus 4.1',
    provider: 'Anthropic',
    version: '4.1',
    type: 'multimodal',
    contextWindow: 200000,
    costPer1MTokens: { input: 15.00, output: 75.00 },
    capabilities: [
      'text', 'vision', 'extended-thinking', 'agent-skills',
      'code-execution', 'web-search', 'web-fetch', 'memory',
      'files-api', 'mcp-connector', 'prompt-caching', 'citations'
    ],
    status: 'active',
    releaseDate: '2025-08-05'
  },
  {
    id: 'claude-sonnet-4.5',
    name: 'Claude Sonnet 4.5',
    provider: 'Anthropic',
    version: '4.5',
    type: 'multimodal',
    contextWindow: 1000000, // 1M tokens!
    costPer1MTokens: { input: 3.00, output: 15.00 },
    capabilities: [
      'text', 'vision', 'extended-thinking', 'agent-skills',
      'code-execution', 'web-search', 'web-fetch', 'memory',
      'files-api', 'mcp-connector', 'prompt-caching', 'citations',
      'best-coding-model'
    ],
    status: 'active',
    releaseDate: '2025-09-29'
  },
  {
    id: 'claude-haiku-4.5',
    name: 'Claude Haiku 4.5',
    provider: 'Anthropic',
    version: '4.5',
    type: 'multimodal',
    contextWindow: 200000,
    costPer1MTokens: { input: 0.80, output: 4.00 },
    capabilities: [
      'text', 'vision', 'agent-skills', 'code-execution',
      'web-search', 'web-fetch', 'memory', 'files-api',
      'mcp-connector', 'prompt-caching', 'fastest-model'
    ],
    status: 'active',
    releaseDate: '2025-10-15'
  },
  {
    id: 'claude-sonnet-3.5',
    name: 'Claude Sonnet 3.5',
    provider: 'Anthropic',
    version: '3.5',
    type: 'text',
    contextWindow: 200000,
    costPer1MTokens: { input: 3.00, output: 15.00 },
    capabilities: ['text', 'vision'],
    status: 'deprecated',
    releaseDate: '2024-06-20',
    deprecationDate: '2025-10-22'
  },

  // Google Gemini Models
  {
    id: 'gemini-2.0-pro',
    name: 'Gemini 2.0 Pro',
    provider: 'Google',
    version: '2.0',
    type: 'multimodal',
    contextWindow: 1000000,
    costPer1MTokens: { input: 1.25, output: 5.00 },
    capabilities: ['text', 'vision', 'audio', 'video', 'function-calling'],
    status: 'active',
    releaseDate: '2025-12-11'
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    version: '1.5',
    type: 'multimodal',
    contextWindow: 2000000, // 2M tokens!
    costPer1MTokens: { input: 1.25, output: 5.00 },
    capabilities: ['text', 'vision', 'audio', 'video', 'function-calling'],
    status: 'active',
    releaseDate: '2024-05-14'
  },

  // xAI Grok Models
  {
    id: 'grok-2',
    name: 'Grok 2',
    provider: 'xAI',
    version: '2.0',
    type: 'multimodal',
    contextWindow: 128000,
    costPer1MTokens: { input: 2.00, output: 10.00 },
    capabilities: ['text', 'vision', 'real-time-data', 'image-generation', 'companions'],
    status: 'active',
    releaseDate: '2024-08-13'
  },
  {
    id: 'grok-2-mini',
    name: 'Grok 2 Mini',
    provider: 'xAI',
    version: '2.0',
    type: 'text',
    contextWindow: 128000,
    costPer1MTokens: { input: 0.50, output: 2.00 },
    capabilities: ['text', 'real-time-data', 'fast-response'],
    status: 'active',
    releaseDate: '2024-08-13'
  },

  // DeepSeek Models
  {
    id: 'deepseek-v3.2',
    name: 'DeepSeek V3.2',
    provider: 'DeepSeek',
    version: '3.2',
    type: 'text',
    contextWindow: 64000,
    costPer1MTokens: { input: 0.14, output: 0.28 },
    capabilities: ['text', 'code-generation', 'multilingual', 'sparse-attention'],
    status: 'active',
    releaseDate: '2025-09-29'
  },

  // Meta Llama Models
  {
    id: 'llama-3.2-90b',
    name: 'Llama 3.2 90B',
    provider: 'Meta',
    version: '3.2',
    type: 'text',
    contextWindow: 128000,
    costPer1MTokens: { input: 0.60, output: 0.90 },
    capabilities: ['text', 'code-generation', 'open-source', 'fine-tuning'],
    status: 'active',
    releaseDate: '2024-09-25'
  },
  {
    id: 'llama-3.2-11b-vision',
    name: 'Llama 3.2 11B Vision',
    provider: 'Meta',
    version: '3.2',
    type: 'multimodal',
    contextWindow: 128000,
    costPer1MTokens: { input: 0.35, output: 0.55 },
    capabilities: ['text', 'vision', 'open-source', 'fine-tuning'],
    status: 'active',
    releaseDate: '2024-09-25'
  },

  // Mistral AI Models
  {
    id: 'mistral-large-2',
    name: 'Mistral Large 2',
    provider: 'Mistral AI',
    version: '2.0',
    type: 'text',
    contextWindow: 128000,
    costPer1MTokens: { input: 2.00, output: 6.00 },
    capabilities: ['text', 'code-generation', 'function-calling', 'european-data'],
    status: 'active',
    releaseDate: '2024-07-24'
  },
  {
    id: 'mistral-medium',
    name: 'Mistral Medium',
    provider: 'Mistral AI',
    version: '1.0',
    type: 'text',
    contextWindow: 32000,
    costPer1MTokens: { input: 1.00, output: 3.00 },
    capabilities: ['text', 'code-generation', 'european-data'],
    status: 'active',
    releaseDate: '2024-03-15'
  },

  // Alibaba Qwen Models
  {
    id: 'qwen-2.5-72b',
    name: 'Qwen 2.5 72B',
    provider: 'Alibaba',
    version: '2.5',
    type: 'multimodal',
    contextWindow: 128000,
    costPer1MTokens: { input: 0.50, output: 1.50 },
    capabilities: ['text', 'vision', 'code-generation', 'chinese-optimized', 'multilingual'],
    status: 'active',
    releaseDate: '2024-09-19'
  },

  // Perplexity Models
  {
    id: 'perplexity-sonar-pro',
    name: 'Perplexity Sonar Pro',
    provider: 'Perplexity',
    version: '1.0',
    type: 'text',
    contextWindow: 127000,
    costPer1MTokens: { input: 1.00, output: 1.00 },
    capabilities: ['text', 'real-time-search', 'citations', 'research-mode'],
    status: 'active',
    releaseDate: '2024-08-01'
  }
];

// Helper functions
export const getActiveModels = () => AI_MODELS.filter(m => m.status === 'active');
export const getModelById = (id: string) => AI_MODELS.find(m => m.id === id);
export const getModelsByProvider = (provider: string) => AI_MODELS.filter(m => m.provider === provider);
export const getModelsByCapability = (capability: string) => AI_MODELS.filter(m => m.capabilities.includes(capability));
export const getCheapestModel = () => AI_MODELS.reduce((cheapest, model) => 
  model.costPer1MTokens.input < cheapest.costPer1MTokens.input ? model : cheapest
);
export const getFastestModel = () => AI_MODELS.find(m => m.capabilities.includes('fastest-model'));
export const getBestCodingModel = () => AI_MODELS.find(m => m.capabilities.includes('best-coding-model'));

// Model selection logic
export const selectOptimalModel = (requirements: {
  needsVision?: boolean;
  needsCode?: boolean;
  needsSearch?: boolean;
  maxCost?: number;
  minContext?: number;
}) => {
  let candidates = getActiveModels();

  if (requirements.needsVision) {
    candidates = candidates.filter(m => m.capabilities.includes('vision'));
  }
  if (requirements.needsCode) {
    candidates = candidates.filter(m => m.capabilities.includes('code-generation') || m.capabilities.includes('code-execution'));
  }
  if (requirements.needsSearch) {
    candidates = candidates.filter(m => m.capabilities.includes('web-search') || m.capabilities.includes('real-time-search'));
  }
  if (requirements.maxCost) {
    candidates = candidates.filter(m => m.costPer1MTokens.input <= requirements.maxCost);
  }
  if (requirements.minContext) {
    candidates = candidates.filter(m => m.contextWindow >= requirements.minContext);
  }

  // Return best match based on cost-performance ratio
  return candidates.sort((a, b) => a.costPer1MTokens.input - b.costPer1MTokens.input)[0];
};


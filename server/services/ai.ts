import OpenAI from 'openai';

// Initialize OpenAI client with API key from environment
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * AI Chat Service
 * Provides conversational AI capabilities using OpenAI GPT models
 */
export class AIChatService {
  private model: string;

  constructor(model: string = 'gpt-4.1-mini') {
    this.model = model;
  }

  /**
   * Send a chat message and get AI response
   */
  async chat(messages: ChatMessage[]): Promise<AIResponse> {
    try {
      const completion = await openai.chat.completions.create({
        model: this.model,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      });

      return {
        content: completion.choices[0]?.message?.content || '',
        usage: completion.usage,
      };
    } catch (error) {
      console.error('AI chat error:', error);
      throw new Error('Failed to get AI response');
    }
  }

  /**
   * Get AI assistant response for a single user message
   */
  async getResponse(userMessage: string, systemPrompt?: string): Promise<string> {
    const messages: ChatMessage[] = [];
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    
    messages.push({ role: 'user', content: userMessage });

    const response = await this.chat(messages);
    return response.content;
  }
}

/**
 * Content Recommendation Service
 * Provides AI-powered content recommendations
 */
export class RecommendationService {
  private chatService: AIChatService;

  constructor() {
    this.chatService = new AIChatService();
  }

  /**
   * Get personalized post recommendations
   */
  async recommendPosts(userInterests: string[], recentPosts: any[]): Promise<string[]> {
    const prompt = `Based on user interests: ${userInterests.join(', ')}
    
Recent posts: ${JSON.stringify(recentPosts.map(p => ({ id: p.id, content: p.content })))}

Recommend the top 5 post IDs that would be most relevant to this user. Return only the IDs as a comma-separated list.`;

    const response = await this.chatService.getResponse(
      prompt,
      'You are a content recommendation system. Provide only post IDs, no explanations.'
    );

    return response.split(',').map(id => id.trim());
  }

  /**
   * Get personalized product recommendations
   */
  async recommendProducts(userHistory: any[], availableProducts: any[]): Promise<string[]> {
    const prompt = `User purchase history: ${JSON.stringify(userHistory)}
    
Available products: ${JSON.stringify(availableProducts.map(p => ({ id: p.id, name: p.name, category: p.category })))}

Recommend the top 5 product IDs that would interest this user. Return only the IDs as a comma-separated list.`;

    const response = await this.chatService.getResponse(
      prompt,
      'You are a product recommendation system. Provide only product IDs, no explanations.'
    );

    return response.split(',').map(id => id.trim());
  }

  /**
   * Get personalized course recommendations
   */
  async recommendCourses(userSkills: string[], availableCourses: any[]): Promise<string[]> {
    const prompt = `User skills: ${userSkills.join(', ')}
    
Available courses: ${JSON.stringify(availableCourses.map(c => ({ id: c.id, title: c.title, level: c.level })))}

Recommend the top 5 course IDs that would help this user grow. Return only the IDs as a comma-separated list.`;

    const response = await this.chatService.getResponse(
      prompt,
      'You are a course recommendation system. Provide only course IDs, no explanations.'
    );

    return response.split(',').map(id => id.trim());
  }
}

/**
 * Text Analysis Service
 * Provides AI-powered text analysis capabilities
 */
export class TextAnalysisService {
  private chatService: AIChatService;

  constructor() {
    this.chatService = new AIChatService();
  }

  /**
   * Analyze sentiment of text
   */
  async analyzeSentiment(text: string): Promise<{ sentiment: 'positive' | 'negative' | 'neutral'; score: number }> {
    const prompt = `Analyze the sentiment of this text: "${text}"
    
Return only a JSON object with format: {"sentiment": "positive|negative|neutral", "score": 0.0-1.0}`;

    const response = await this.chatService.getResponse(
      prompt,
      'You are a sentiment analysis system. Return only valid JSON, no explanations.'
    );

    try {
      return JSON.parse(response);
    } catch {
      return { sentiment: 'neutral', score: 0.5 };
    }
  }

  /**
   * Extract key topics from text
   */
  async extractTopics(text: string): Promise<string[]> {
    const prompt = `Extract the main topics from this text: "${text}"
    
Return only a comma-separated list of topics, no explanations.`;

    const response = await this.chatService.getResponse(
      prompt,
      'You are a topic extraction system. Provide only topics as comma-separated values.'
    );

    return response.split(',').map(topic => topic.trim());
  }

  /**
   * Summarize text
   */
  async summarize(text: string, maxLength: number = 100): Promise<string> {
    const prompt = `Summarize this text in ${maxLength} words or less: "${text}"`;

    return await this.chatService.getResponse(
      prompt,
      'You are a text summarization system. Provide concise, accurate summaries.'
    );
  }

  /**
   * Moderate content for inappropriate material
   */
  async moderateContent(text: string): Promise<{ safe: boolean; categories: string[] }> {
    const prompt = `Analyze this content for inappropriate material: "${text}"
    
Return only a JSON object with format: {"safe": true|false, "categories": ["category1", "category2"]}
Categories can include: hate, violence, sexual, harassment, self-harm`;

    const response = await this.chatService.getResponse(
      prompt,
      'You are a content moderation system. Return only valid JSON, no explanations.'
    );

    try {
      return JSON.parse(response);
    } catch {
      return { safe: true, categories: [] };
    }
  }
}

/**
 * Smart Search Service
 * Provides AI-enhanced search capabilities
 */
export class SmartSearchService {
  private chatService: AIChatService;

  constructor() {
    this.chatService = new AIChatService();
  }

  /**
   * Enhance search query with AI
   */
  async enhanceQuery(query: string): Promise<{ enhancedQuery: string; suggestions: string[] }> {
    const prompt = `User search query: "${query}"
    
Provide:
1. An enhanced version of the query
2. 3 related search suggestions

Return as JSON: {"enhancedQuery": "...", "suggestions": ["...", "...", "..."]}`;

    const response = await this.chatService.getResponse(
      prompt,
      'You are a search enhancement system. Return only valid JSON, no explanations.'
    );

    try {
      return JSON.parse(response);
    } catch {
      return { enhancedQuery: query, suggestions: [] };
    }
  }

  /**
   * Rank search results by relevance
   */
  async rankResults(query: string, results: any[]): Promise<string[]> {
    const prompt = `Search query: "${query}"
    
Results: ${JSON.stringify(results.map(r => ({ id: r.id, title: r.title || r.name, description: r.description || r.content })))}

Rank these results by relevance to the query. Return only the IDs in order of relevance as a comma-separated list.`;

    const response = await this.chatService.getResponse(
      prompt,
      'You are a search ranking system. Provide only result IDs in order, no explanations.'
    );

    return response.split(',').map(id => id.trim());
  }
}

// Export service instances
export const aiChatService = new AIChatService();
export const recommendationService = new RecommendationService();
export const textAnalysisService = new TextAnalysisService();
export const smartSearchService = new SmartSearchService();


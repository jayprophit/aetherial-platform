import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { TRPCError } from "@trpc/server";

/**
 * AI Assistant Router
 * 
 * Provides AI-powered assistance for both creators (admin) and users (public).
 * Supports multiple AI models (GPT-4, Claude, Gemini) with intelligent routing.
 */

// ============================================================================
// TYPES & SCHEMAS
// ============================================================================

const AIModelSchema = z.enum([
  "gpt-4o",
  "gpt-4o-mini",
  "claude-opus-4-1",
  "claude-sonnet-4-5",
  "claude-haiku-4-5",
  "deepseek-v3-2",
  "qwen-2-5",
  "grok-2",
  "gemini-pro",
  "perplexity",
  "auto"
]);

const AIContextSchema = z.enum([
  "admin",
  "user",
  "product",
  "course",
  "support",
  "shopping",
  "learning",
  "content"
]);

const AIMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
  timestamp: z.date().optional(),
});

const AITaskTypeSchema = z.enum([
  // E-Commerce
  "product_description",
  "product_title",
  "pricing_strategy",
  "product_specs",
  "marketing_copy",
  "category_tags",
  "competitor_analysis",
  
  // E-Learning
  "course_outline",
  "lesson_content",
  "quiz_questions",
  "video_script",
  "learning_objectives",
  "assignments",
  "curriculum_design",
  
  // Content
  "blog_post",
  "social_media_post",
  "captions_hashtags",
  "newsletter",
  "product_review",
  "faq_generation",
  "landing_page",
  
  // Analytics
  "analytics_insights",
  "sales_report",
  "customer_behavior",
  "inventory_alerts",
  "financial_summary",
  "marketing_recommendations",
  "performance_optimization",
  
  // User Assistance
  "product_recommendations",
  "price_comparison",
  "size_fit_advice",
  "style_suggestions",
  "order_tracking",
  "return_handling",
  
  // Learning Assistance
  "course_recommendations",
  "study_plan",
  "concept_explanation",
  "practice_problems",
  "progress_tracking",
  "career_guidance",
  
  // General
  "platform_navigation",
  "account_management",
  "troubleshooting",
  "feature_explanation",
  "content_improvement",
  "grammar_check",
  "idea_generation"
]);

// ============================================================================
// AI MODEL SELECTION
// ============================================================================

/**
 * Selects the best AI model for a given task type (Updated October 2025)
 * Based on latest model capabilities and benchmarks
 */
function selectModelForTask(taskType: z.infer<typeof AITaskTypeSchema>): string {
  // Claude Sonnet 4.5: Best coding model in the world (Sep 2025)
  const claudeSonnet45Tasks = [
    "product_specs",
    "quiz_questions",
    "video_script",
    "assignments",
    "curriculum_design",
    "landing_page"
  ];
  
  // GPT-4o: Best for creative writing and multimodal content
  const gpt4oTasks = [
    "product_description",
    "product_title",
    "marketing_copy",
    "course_outline",
    "lesson_content",
    "video_script",
    "assignments",
    "blog_post",
    "social_media_post",
    "captions_hashtags",
    "newsletter",
    "product_review",
    "landing_page",
    "size_fit_advice",
    "style_suggestions",
    "study_plan",
    "concept_explanation",
    "practice_problems",
    "platform_navigation",
    "account_management",
    "feature_explanation",
    "content_improvement",
    "grammar_check",
    "idea_generation"
  ];
  
  // Claude Opus 4.1: Best for complex reasoning and research (Aug 2025)
  const claudeOpus41Tasks = [
    "pricing_strategy",
    "category_tags",
    "competitor_analysis",
    "learning_objectives",
    "curriculum_design",
    "faq_generation",
    "analytics_insights",
    "sales_report",
    "customer_behavior",
    "inventory_alerts",
    "financial_summary",
    "marketing_recommendations",
    "performance_optimization",
    "product_recommendations",
    "price_comparison",
    "course_recommendations",
    "progress_tracking",
    "career_guidance",
    "troubleshooting"
  ];
  
  // Claude Haiku 4.5: Fastest with near-frontier performance (Oct 2025)
  const claudeHaiku45Tasks = [
    "order_tracking",
    "return_handling",
    "platform_navigation",
    "account_management"
  ];
  
  // Perplexity: Best for real-time research and citations
  const perplexityTasks = [
    "competitor_analysis",
    "analytics_insights",
    "customer_behavior",
    "troubleshooting"
  ];
  
  if (claudeSonnet45Tasks.includes(taskType)) return "claude-sonnet-4-5";
  if (gpt4oTasks.includes(taskType)) return "gpt-4o";
  if (claudeOpus41Tasks.includes(taskType)) return "claude-opus-4-1";
  if (claudeHaiku45Tasks.includes(taskType)) return "claude-haiku-4-5";
  if (perplexityTasks.includes(taskType)) return "perplexity";
  
  return "claude-sonnet-4-5"; // Default to best coding model
}

// ============================================================================
// SYSTEM PROMPTS
// ============================================================================

const SYSTEM_PROMPTS = {
  admin: `You are an AI assistant for business owners and creators on the AETHERIAL Platform. 
Your role is to help them create products, courses, content, and manage their business effectively.
Be professional, creative, and provide actionable advice. Always consider SEO, user experience, and business goals.`,

  user: `You are an AI assistant for users of the AETHERIAL Platform.
Your role is to help them find products, learn new skills, and navigate the platform.
Be friendly, helpful, and provide clear explanations. Always prioritize user satisfaction and learning.`,

  product: `You are an AI assistant specialized in e-commerce product creation and management.
Help creators write compelling product descriptions, titles, specifications, and marketing copy.
Focus on SEO optimization, conversion rates, and customer appeal.`,

  course: `You are an AI assistant specialized in e-learning course creation and management.
Help creators design effective courses, write engaging content, and create assessments.
Focus on learning outcomes, student engagement, and educational best practices.`,

  support: `You are an AI customer support assistant for the AETHERIAL Platform.
Help users with their questions, troubleshoot issues, and provide guidance.
Be empathetic, patient, and solution-oriented. Escalate to human support when necessary.`,

  shopping: `You are an AI shopping assistant for the AETHERIAL Platform.
Help users find products, compare prices, get size advice, and make informed purchase decisions.
Be helpful, knowledgeable, and personalized in your recommendations.`,

  learning: `You are an AI learning assistant for the AETHERIAL Platform.
Help users learn new skills, understand concepts, and achieve their educational goals.
Be encouraging, clear, and adaptive to different learning styles.`,

  content: `You are an AI content creation assistant for the AETHERIAL Platform.
Help users write posts, improve their writing, and generate creative ideas.
Be creative, constructive, and supportive of their expression.`
};

// ============================================================================
// AI ASSISTANT ROUTER
// ============================================================================

export const aiAssistantRouter = router({
  /**
   * Chat with AI assistant
   * Supports conversation history and context
   */
  chat: publicProcedure
    .input(z.object({
      message: z.string().min(1).max(10000),
      context: AIContextSchema.default("user"),
      conversationHistory: z.array(AIMessageSchema).optional(),
      model: AIModelSchema.default("auto"),
      metadata: z.record(z.any()).optional()
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const { message, context, conversationHistory = [], model, metadata } = input;
        
        // Build messages array
        const messages: any[] = [
          {
            role: "system",
            content: SYSTEM_PROMPTS[context] || SYSTEM_PROMPTS.user
          },
          ...conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          {
            role: "user",
            content: message
          }
        ];
        
        // Call LLM
        const response = await invokeLLM({ messages });
        
        const assistantMessage = response.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
        
        return {
          success: true,
          message: assistantMessage,
          model: model === "auto" ? "gpt-4" : model,
          tokensUsed: response.usage?.total_tokens || 0
        };
      } catch (error) {
        console.error("[AI Assistant] Chat error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate AI response"
        });
      }
    }),

  /**
   * Execute a specific AI task
   * Automatically selects the best model for the task
   */
  executeTask: protectedProcedure
    .input(z.object({
      taskType: AITaskTypeSchema,
      input: z.record(z.any()),
      model: AIModelSchema.default("auto")
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const { taskType, input: taskInput, model } = input;
        
        // Select model if auto
        const selectedModel = model === "auto" ? selectModelForTask(taskType) : model;
        
        // Build task-specific prompt
        const prompt = buildTaskPrompt(taskType, taskInput);
        
        const messages = [
          {
            role: "system" as const,
            content: getTaskSystemPrompt(taskType)
          },
          {
            role: "user" as const,
            content: prompt
          }
        ];
        
        // Call LLM
        const response = await invokeLLM({ messages });
        
        const result = response.choices[0]?.message?.content || "";
        
        // TODO: Save task to database for tracking
        
        return {
          success: true,
          taskType,
          result,
          model: selectedModel,
          tokensUsed: response.usage?.total_tokens || 0
        };
      } catch (error) {
        console.error("[AI Assistant] Task execution error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to execute AI task"
        });
      }
    }),

  /**
   * Get AI task templates
   * Returns pre-defined templates for common tasks
   */
  getTemplates: publicProcedure
    .input(z.object({
      category: z.enum(["product", "course", "content", "marketing", "all"]).default("all")
    }))
    .query(async ({ input }) => {
      // TODO: Load from database
      const templates = getTaskTemplates(input.category);
      return {
        success: true,
        templates
      };
    }),

  /**
   * Get AI usage statistics
   * For tracking costs and usage
   */
  getUsageStats: protectedProcedure
    .input(z.object({
      startDate: z.date().optional(),
      endDate: z.date().optional()
    }))
    .query(async ({ input, ctx }) => {
      // TODO: Query from database
      return {
        success: true,
        stats: {
          totalRequests: 0,
          totalTokens: 0,
          estimatedCost: 0,
          requestsByModel: {},
          requestsByTaskType: {}
        }
      };
    })
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function buildTaskPrompt(taskType: z.infer<typeof AITaskTypeSchema>, input: Record<string, any>): string {
  const prompts: Record<string, (input: any) => string> = {
    product_description: (i) => `Generate a compelling product description for:
Product Name: ${i.name}
Category: ${i.category}
Key Features: ${i.features}
Target Audience: ${i.audience || "General"}

Please provide:
1. A short description (50-100 words) for listings
2. A detailed description (200-300 words) for product pages
3. SEO keywords to include`,

    product_title: (i) => `Generate 5 product title variations for:
Product: ${i.description}
Category: ${i.category}
Keywords: ${i.keywords || ""}

Requirements:
- SEO-optimized
- Clear and descriptive
- Under 80 characters
- Include key features`,

    pricing_strategy: (i) => `Analyze and suggest pricing strategy for:
Product: ${i.name}
Cost: $${i.cost}
Competitor Prices: ${i.competitorPrices}
Market Position: ${i.marketPosition || "Mid-range"}

Provide:
1. Recommended price with rationale
2. Pricing tiers (if applicable)
3. Discount strategies
4. Competitive positioning`,

    course_outline: (i) => `Create a comprehensive course outline for:
Course Topic: ${i.topic}
Target Audience: ${i.audience}
Duration: ${i.duration || "4-6 weeks"}
Skill Level: ${i.skillLevel || "Beginner"}

Include:
1. Course overview and objectives
2. Module breakdown (5-8 modules)
3. Lesson topics for each module
4. Estimated time per module
5. Prerequisites (if any)`,

    blog_post: (i) => `Write a blog post about:
Topic: ${i.topic}
Target Keywords: ${i.keywords || ""}
Tone: ${i.tone || "Professional"}
Length: ${i.length || "800-1000"} words

Include:
1. Engaging title (with keyword)
2. Introduction hook
3. Main content with subheadings
4. Conclusion with CTA
5. Meta description`,

    // Add more task-specific prompts as needed
  };

  const promptBuilder = prompts[taskType];
  if (promptBuilder) {
    return promptBuilder(input);
  }

  // Fallback generic prompt
  return `Task: ${taskType}\nInput: ${JSON.stringify(input, null, 2)}`;
}

function getTaskSystemPrompt(taskType: z.infer<typeof AITaskTypeSchema>): string {
  const category = getTaskCategory(taskType);
  
  const categoryPrompts: Record<string, string> = {
    product: SYSTEM_PROMPTS.product,
    course: SYSTEM_PROMPTS.course,
    content: SYSTEM_PROMPTS.content,
    shopping: SYSTEM_PROMPTS.shopping,
    learning: SYSTEM_PROMPTS.learning,
    support: SYSTEM_PROMPTS.support,
    admin: SYSTEM_PROMPTS.admin
  };

  return categoryPrompts[category] || SYSTEM_PROMPTS.user;
}

function getTaskCategory(taskType: z.infer<typeof AITaskTypeSchema>): string {
  if (taskType.startsWith("product_")) return "product";
  if (taskType.startsWith("course_") || taskType.includes("learning")) return "course";
  if (taskType.includes("content") || taskType.includes("post") || taskType.includes("blog")) return "content";
  if (taskType.includes("shopping") || taskType.includes("price") || taskType.includes("recommendation")) return "shopping";
  if (taskType.includes("study") || taskType.includes("concept")) return "learning";
  if (taskType.includes("support") || taskType.includes("troubleshoot")) return "support";
  return "admin";
}

function getTaskTemplates(category: string) {
  // TODO: Load from database
  const allTemplates = [
    {
      id: "product-desc-basic",
      name: "Basic Product Description",
      category: "product",
      description: "Generate a standard product description",
      taskType: "product_description",
      parameters: {
        name: "Product name",
        category: "Product category",
        features: "Key features (comma-separated)",
        audience: "Target audience (optional)"
      }
    },
    {
      id: "course-outline-beginner",
      name: "Beginner Course Outline",
      category: "course",
      description: "Create a course outline for beginners",
      taskType: "course_outline",
      parameters: {
        topic: "Course topic",
        duration: "Course duration (e.g., 4 weeks)",
        audience: "Target audience"
      }
    },
    {
      id: "blog-post-seo",
      name: "SEO Blog Post",
      category: "content",
      description: "Write an SEO-optimized blog post",
      taskType: "blog_post",
      parameters: {
        topic: "Blog topic",
        keywords: "Target keywords",
        length: "Word count (e.g., 1000)"
      }
    }
  ];

  if (category === "all") return allTemplates;
  return allTemplates.filter(t => t.category === category);
}


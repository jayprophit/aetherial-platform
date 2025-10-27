import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  aiChatService,
  recommendationService,
  textAnalysisService,
  smartSearchService,
} from '../services/ai';
import {
  aiAnalyticsService,
  personalizationEngine,
  predictiveModelingService,
} from '../services/aiAnalytics';

const router = express.Router();

// POST /api/ai/chat - Chat with AI assistant
router.post('/chat', authenticateToken, async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const response = await aiChatService.chat(messages);

    res.json({ response });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

// POST /api/ai/ask - Ask AI a single question
router.post('/ask', authenticateToken, async (req, res) => {
  try {
    const { question, context } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const response = await aiChatService.getResponse(question, context);

    res.json({ answer: response });
  } catch (error) {
    console.error('AI ask error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

// POST /api/ai/recommend/posts - Get post recommendations
router.post('/recommend/posts', authenticateToken, async (req, res) => {
  try {
    const { userInterests, recentPosts } = req.body;

    if (!userInterests || !recentPosts) {
      return res.status(400).json({ error: 'User interests and recent posts are required' });
    }

    const recommendations = await recommendationService.recommendPosts(userInterests, recentPosts);

    res.json({ recommendations });
  } catch (error) {
    console.error('Post recommendation error:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

// POST /api/ai/recommend/products - Get product recommendations
router.post('/recommend/products', authenticateToken, async (req, res) => {
  try {
    const { userHistory, availableProducts } = req.body;

    if (!userHistory || !availableProducts) {
      return res.status(400).json({ error: 'User history and available products are required' });
    }

    const recommendations = await recommendationService.recommendProducts(userHistory, availableProducts);

    res.json({ recommendations });
  } catch (error) {
    console.error('Product recommendation error:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

// POST /api/ai/recommend/courses - Get course recommendations
router.post('/recommend/courses', authenticateToken, async (req, res) => {
  try {
    const { userSkills, availableCourses } = req.body;

    if (!userSkills || !availableCourses) {
      return res.status(400).json({ error: 'User skills and available courses are required' });
    }

    const recommendations = await recommendationService.recommendCourses(userSkills, availableCourses);

    res.json({ recommendations });
  } catch (error) {
    console.error('Course recommendation error:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

// POST /api/ai/analyze/sentiment - Analyze text sentiment
router.post('/analyze/sentiment', authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const result = await textAnalysisService.analyzeSentiment(text);

    res.json({ result });
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze sentiment' });
  }
});

// POST /api/ai/analyze/topics - Extract topics from text
router.post('/analyze/topics', authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const topics = await textAnalysisService.extractTopics(text);

    res.json({ topics });
  } catch (error) {
    console.error('Topic extraction error:', error);
    res.status(500).json({ error: 'Failed to extract topics' });
  }
});

// POST /api/ai/summarize - Summarize text
router.post('/summarize', authenticateToken, async (req, res) => {
  try {
    const { text, maxLength } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const summary = await textAnalysisService.summarize(text, maxLength);

    res.json({ summary });
  } catch (error) {
    console.error('Summarization error:', error);
    res.status(500).json({ error: 'Failed to summarize text' });
  }
});

// POST /api/ai/moderate - Moderate content
router.post('/moderate', authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const result = await textAnalysisService.moderateContent(text);

    res.json({ result });
  } catch (error) {
    console.error('Content moderation error:', error);
    res.status(500).json({ error: 'Failed to moderate content' });
  }
});

// POST /api/ai/search/enhance - Enhance search query
router.post('/search/enhance', authenticateToken, async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const result = await smartSearchService.enhanceQuery(query);

    res.json({ result });
  } catch (error) {
    console.error('Search enhancement error:', error);
    res.status(500).json({ error: 'Failed to enhance search query' });
  }
});

// POST /api/ai/search/rank - Rank search results
router.post('/search/rank', authenticateToken, async (req, res) => {
  try {
    const { query, results } = req.body;

    if (!query || !results) {
      return res.status(400).json({ error: 'Query and results are required' });
    }

    const rankedIds = await smartSearchService.rankResults(query, results);

    res.json({ rankedIds });
  } catch (error) {
    console.error('Search ranking error:', error);
    res.status(500).json({ error: 'Failed to rank search results' });
  }
});

// POST /api/ai/analytics/behavior - Analyze user behavior
router.post('/analytics/behavior', authenticateToken, async (req, res) => {
  try {
    const { userId, activities } = req.body;

    if (!userId || !activities) {
      return res.status(400).json({ error: 'User ID and activities are required' });
    }

    const insights = await aiAnalyticsService.analyzeUserBehavior(userId, activities);

    res.json({ insights });
  } catch (error) {
    console.error('Behavior analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze behavior' });
  }
});

// POST /api/ai/analytics/churn - Predict churn risk
router.post('/analytics/churn', authenticateToken, async (req, res) => {
  try {
    const { userId, userMetrics } = req.body;

    if (!userId || !userMetrics) {
      return res.status(400).json({ error: 'User ID and metrics are required' });
    }

    const prediction = await aiAnalyticsService.predictChurnRisk(userId, userMetrics);

    res.json({ prediction });
  } catch (error) {
    console.error('Churn prediction error:', error);
    res.status(500).json({ error: 'Failed to predict churn' });
  }
});

// POST /api/ai/personalize/homepage - Personalize homepage
router.post('/personalize/homepage', authenticateToken, async (req, res) => {
  try {
    const { userId, userProfile } = req.body;

    if (!userId || !userProfile) {
      return res.status(400).json({ error: 'User ID and profile are required' });
    }

    const layout = await personalizationEngine.personalizeHomepage(userId, userProfile);

    res.json({ layout });
  } catch (error) {
    console.error('Homepage personalization error:', error);
    res.status(500).json({ error: 'Failed to personalize homepage' });
  }
});

// POST /api/ai/predict/demand - Predict product demand
router.post('/predict/demand', authenticateToken, async (req, res) => {
  try {
    const { productId, historicalSales } = req.body;

    if (!productId || !historicalSales) {
      return res.status(400).json({ error: 'Product ID and historical sales are required' });
    }

    const prediction = await predictiveModelingService.predictProductDemand(productId, historicalSales);

    res.json({ prediction });
  } catch (error) {
    console.error('Demand prediction error:', error);
    res.status(500).json({ error: 'Failed to predict demand' });
  }
});

export default router;


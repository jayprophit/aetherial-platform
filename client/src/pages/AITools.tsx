import { useState } from 'react';
import { 
  Sparkles, 
  Package, 
  GraduationCap, 
  FileText, 
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Tag,
  BarChart,
  BookOpen,
  Video,
  CheckSquare,
  Target,
  PenTool,
  Mail,
  Star
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AITaskExecutor from '@/components/ai/AITaskExecutor';

export default function AITools() {
  const [activeCategory, setActiveCategory] = useState('product');

  const categories = [
    {
      id: 'product',
      name: 'E-Commerce',
      icon: Package,
      description: 'AI tools for product creation and management',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'course',
      name: 'E-Learning',
      icon: GraduationCap,
      description: 'AI tools for course creation and content',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'content',
      name: 'Content',
      icon: FileText,
      description: 'AI tools for blog posts and marketing',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: TrendingUp,
      description: 'AI-powered business insights',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const productTools = [
    {
      taskType: 'product_description',
      title: 'Product Description Generator',
      description: 'Generate SEO-optimized product descriptions',
      icon: Package,
      fields: [
        { name: 'name', label: 'Product Name', type: 'text' as const, required: true, placeholder: 'e.g., Wireless Bluetooth Headphones' },
        { name: 'category', label: 'Category', type: 'text' as const, required: true, placeholder: 'e.g., Electronics' },
        { name: 'features', label: 'Key Features', type: 'textarea' as const, required: true, placeholder: 'List main features (comma-separated)' },
        { name: 'audience', label: 'Target Audience', type: 'text' as const, placeholder: 'e.g., Music lovers, commuters' }
      ]
    },
    {
      taskType: 'product_title',
      title: 'Product Title Generator',
      description: 'Create compelling, SEO-friendly product titles',
      icon: Tag,
      fields: [
        { name: 'description', label: 'Product Description', type: 'textarea' as const, required: true, placeholder: 'Brief description of your product' },
        { name: 'category', label: 'Category', type: 'text' as const, required: true },
        { name: 'keywords', label: 'Target Keywords', type: 'text' as const, placeholder: 'Keywords to include (comma-separated)' }
      ]
    },
    {
      taskType: 'pricing_strategy',
      title: 'Pricing Strategy Advisor',
      description: 'Get AI-powered pricing recommendations',
      icon: DollarSign,
      fields: [
        { name: 'name', label: 'Product Name', type: 'text' as const, required: true },
        { name: 'cost', label: 'Product Cost', type: 'number' as const, required: true, placeholder: 'Your cost per unit' },
        { name: 'competitorPrices', label: 'Competitor Prices', type: 'text' as const, placeholder: 'e.g., $29.99, $34.99, $39.99' },
        { name: 'marketPosition', label: 'Market Position', type: 'select' as const, options: ['Budget', 'Mid-range', 'Premium', 'Luxury'] }
      ]
    }
  ];

  const courseTools = [
    {
      taskType: 'course_outline',
      title: 'Course Outline Generator',
      description: 'Create comprehensive course structures',
      icon: BookOpen,
      fields: [
        { name: 'topic', label: 'Course Topic', type: 'text' as const, required: true, placeholder: 'e.g., Web Development Fundamentals' },
        { name: 'audience', label: 'Target Audience', type: 'text' as const, required: true, placeholder: 'e.g., Beginners with no coding experience' },
        { name: 'duration', label: 'Course Duration', type: 'text' as const, placeholder: 'e.g., 6 weeks, 20 hours' },
        { name: 'skillLevel', label: 'Skill Level', type: 'select' as const, options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] }
      ]
    },
    {
      taskType: 'lesson_content',
      title: 'Lesson Content Writer',
      description: 'Generate detailed lesson content',
      icon: FileText,
      fields: [
        { name: 'topic', label: 'Lesson Topic', type: 'text' as const, required: true, placeholder: 'e.g., Introduction to HTML' },
        { name: 'objectives', label: 'Learning Objectives', type: 'textarea' as const, required: true, placeholder: 'What students will learn' },
        { name: 'duration', label: 'Lesson Duration', type: 'text' as const, placeholder: 'e.g., 30 minutes' }
      ]
    },
    {
      taskType: 'quiz_questions',
      title: 'Quiz Generator',
      description: 'Create quizzes and assessments',
      icon: CheckSquare,
      fields: [
        { name: 'topic', label: 'Topic/Content', type: 'textarea' as const, required: true, placeholder: 'The lesson content to create quiz for' },
        { name: 'difficulty', label: 'Difficulty Level', type: 'select' as const, options: ['Easy', 'Medium', 'Hard'], required: true },
        { name: 'count', label: 'Number of Questions', type: 'number' as const, placeholder: '10' }
      ]
    },
    {
      taskType: 'video_script',
      title: 'Video Script Writer',
      description: 'Generate video scripts for lessons',
      icon: Video,
      fields: [
        { name: 'topic', label: 'Video Topic', type: 'text' as const, required: true },
        { name: 'duration', label: 'Video Duration', type: 'text' as const, placeholder: 'e.g., 10 minutes' },
        { name: 'style', label: 'Presentation Style', type: 'select' as const, options: ['Tutorial', 'Lecture', 'Conversational', 'Demo'] }
      ]
    }
  ];

  const contentTools = [
    {
      taskType: 'blog_post',
      title: 'Blog Post Writer',
      description: 'Write SEO-optimized blog posts',
      icon: FileText,
      fields: [
        { name: 'topic', label: 'Blog Topic', type: 'text' as const, required: true, placeholder: 'e.g., 10 Tips for Better Productivity' },
        { name: 'keywords', label: 'Target Keywords', type: 'text' as const, placeholder: 'Keywords for SEO' },
        { name: 'tone', label: 'Tone', type: 'select' as const, options: ['Professional', 'Casual', 'Friendly', 'Technical', 'Inspirational'] },
        { name: 'length', label: 'Word Count', type: 'text' as const, placeholder: 'e.g., 1000' }
      ]
    },
    {
      taskType: 'social_media_post',
      title: 'Social Media Post Creator',
      description: 'Generate engaging social media content',
      icon: Star,
      fields: [
        { name: 'topic', label: 'Post Topic', type: 'text' as const, required: true },
        { name: 'platform', label: 'Platform', type: 'select' as const, options: ['Twitter', 'LinkedIn', 'Facebook', 'Instagram'], required: true },
        { name: 'tone', label: 'Tone', type: 'select' as const, options: ['Professional', 'Casual', 'Humorous', 'Inspirational'] }
      ]
    },
    {
      taskType: 'newsletter',
      title: 'Newsletter Writer',
      description: 'Create email newsletters',
      icon: Mail,
      fields: [
        { name: 'topic', label: 'Newsletter Topic', type: 'text' as const, required: true },
        { name: 'audience', label: 'Target Audience', type: 'text' as const, required: true },
        { name: 'sections', label: 'Sections', type: 'textarea' as const, placeholder: 'List sections (e.g., News, Tips, Featured Product)' }
      ]
    }
  ];

  const analyticsTools = [
    {
      taskType: 'analytics_insights',
      title: 'Analytics Insights',
      description: 'Get AI-powered business insights',
      icon: BarChart,
      fields: [
        { name: 'data', label: 'Data Summary', type: 'textarea' as const, required: true, placeholder: 'Paste your analytics data or describe your metrics' },
        { name: 'period', label: 'Time Period', type: 'text' as const, placeholder: 'e.g., Last 30 days' },
        { name: 'focus', label: 'Focus Area', type: 'select' as const, options: ['Sales', 'Traffic', 'Conversions', 'User Behavior', 'Overall'] }
      ]
    },
    {
      taskType: 'marketing_recommendations',
      title: 'Marketing Strategy',
      description: 'Get marketing recommendations',
      icon: Target,
      fields: [
        { name: 'business', label: 'Business Description', type: 'textarea' as const, required: true, placeholder: 'Describe your business and products' },
        { name: 'audience', label: 'Target Audience', type: 'text' as const, required: true },
        { name: 'budget', label: 'Marketing Budget', type: 'text' as const, placeholder: 'e.g., $1000/month' }
      ]
    }
  ];

  const getToolsByCategory = (category: string) => {
    switch (category) {
      case 'product':
        return productTools;
      case 'course':
        return courseTools;
      case 'content':
        return contentTools;
      case 'analytics':
        return analyticsTools;
      default:
        return [];
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-cyan-600" />
          AI Creator Tools
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Powerful AI tools to help you create products, courses, content, and grow your business
        </p>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`text-left p-4 rounded-xl transition-all ${
                isActive
                  ? 'bg-gradient-to-br ' + category.color + ' text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-800 hover:shadow-md'
              }`}
            >
              <Icon className={`w-8 h-8 mb-2 ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
              <h3 className={`font-semibold mb-1 ${isActive ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                {category.name}
              </h3>
              <p className={`text-sm ${isActive ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'}`}>
                {category.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {getToolsByCategory(activeCategory).map((tool) => (
          <AITaskExecutor
            key={tool.taskType}
            taskType={tool.taskType}
            title={tool.title}
            description={tool.description}
            fields={tool.fields}
          />
        ))}
      </div>

      {/* Empty State */}
      {getToolsByCategory(activeCategory).length === 0 && (
        <div className="text-center py-12">
          <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            No tools available in this category yet
          </p>
        </div>
      )}
    </div>
  );
}


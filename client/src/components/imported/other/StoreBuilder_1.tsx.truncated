import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  Store, 
  ShoppingCart, 
  Package, 
  CreditCard, 
  Settings, 
  Eye, 
  Save, 
  Upload,
  Palette,
  Type,
  Layout,
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';

interface StoreTemplate {
  id: string;
  name: string;
  category: string;
  preview: string;
  description: string;
  features: string[];
  colors: string[];
}

interface StoreSection {
  id: string;
  type: string;
  name: string;
  content: any;
  styles: any;
  order: number;
}

interface StoreConfig {
  name: string;
  description: string;
  logo: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  layout: string;
  sections: StoreSection[];
  settings: {
    currency: string;
    shipping: any;
    payments: string[];
    seo: any;
  };
}

const StoreBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [storeConfig, setStoreConfig] = useState<StoreConfig>({
    name: 'My Store',
    description: 'Welcome to my amazing store',
    logo: '',
    colors: {
      primary: '#3B82F6',
      secondary: '#1F2937',
      accent: '#F59E0B',
      background: '#FFFFFF',
      text: '#111827'
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    },
    layout: 'modern',
    sections: [],
    settings: {
      currency: 'USD',
      shipping: {},
      payments: ['stripe', 'paypal'],
      seo: {}
    }
  });
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const storeTemplates: StoreTemplate[] = [
    {
      id: 'modern-minimal',
      name: 'Modern Minimal',
      category: 'Fashion',
      preview: '/templates/modern-minimal.jpg',
      description: 'Clean, minimalist design perfect for fashion and lifestyle brands',
      features: ['Responsive Design', 'Product Showcase', 'Quick Checkout', 'SEO Optimized'],
      colors: ['#000000', '#FFFFFF', '#F5F5F5', '#E5E5E5']
    },
    {
      id: 'tech-store',
      name: 'Tech Store',
      category: 'Technology',
      preview: '/templates/tech-store.jpg',
      description: 'Modern tech-focused design with advanced product filtering',
      features: ['Product Comparison', 'Spec Tables', 'Reviews System', 'Wishlist'],
      colors: ['#1E40AF', '#3B82F6', '#EFF6FF', '#1F2937']
    },
    {
      id: 'luxury-brand',
      name: 'Luxury Brand',
      category: 'Luxury',
      preview: '/templates/luxury-brand.jpg',
      description: 'Elegant design for premium and luxury products',
      features: ['Premium Layouts', 'Video Backgrounds', 'Exclusive Access', 'VIP Features'],
      colors: ['#92400E', '#D97706', '#FEF3C7', '#1F2937']
    },
    {
      id: 'food-beverage',
      name: 'Food & Beverage',
      category: 'Food',
      preview: '/templates/food-beverage.jpg',
      description: 'Appetizing design for restaurants and food businesses',
      features: ['Menu Display', 'Online Ordering', 'Delivery Integration', 'Nutrition Info'],
      colors: ['#DC2626', '#EF4444', '#FEE2E2', '#1F2937']
    },
    {
      id: 'creative-portfolio',
      name: 'Creative Portfolio',
      category: 'Creative',
      preview: '/templates/creative-portfolio.jpg',
      description: 'Showcase creative work with stunning visual layouts',
      features: ['Portfolio Gallery', 'Client Testimonials', 'Service Packages', 'Contact Forms'],
      colors: ['#7C3AED', '#A855F7', '#F3E8FF', '#1F2937']
    },
    {
      id: 'health-wellness',
      name: 'Health & Wellness',
      category: 'Health',
      preview: '/templates/health-wellness.jpg',
      description: 'Calming design for health and wellness products',
      features: ['Appointment Booking', 'Health Tips', 'Product Benefits', 'Testimonials'],
      colors: ['#059669', '#10B981', '#D1FAE5', '#1F2937']
    }
  ];

  const sectionTypes = [
    { id: 'hero', name: 'Hero Section', icon: Layout, description: 'Main banner with call-to-action' },
    { id: 'products', name: 'Product Grid', icon: Package, description: 'Display products in grid layout' },
    { id: 'featured', name: 'Featured Products', icon: Store, description: 'Highlight specific products' },
    { id: 'testimonials', name: 'Testimonials', icon: Type, description: 'Customer reviews and feedback' },
    { id: 'about', name: 'About Section', icon: Edit3, description: 'Tell your brand story' },
    { id: 'contact', name: 'Contact Info', icon: Settings, description: 'Contact details and form' },
    { id: 'newsletter', name: 'Newsletter', icon: Plus, description: 'Email subscription form' },
    { id: 'gallery', name: 'Image Gallery', icon: ImageIcon, description: 'Showcase images' }
  ];

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = storeTemplates.find(t => t.id === templateId);
    if (template) {
      setStoreConfig(prev => ({
        ...prev,
        colors: {
          primary: template.colors[0],
          secondary: template.colors[1],
          accent: template.colors[2] || template.colors[0],
          background: template.colors[3] || '#FFFFFF',
          text: '#111827'
        }
      }));
    }
  };

  const addSection = (sectionType: string) => {
    const newSection: StoreSection = {
      id: `section-${Date.now()}`,
      type: sectionType,
      name: sectionTypes.find(s => s.id === sectionType)?.name || 'New Section',
      content: getDefaultContent(sectionType),
      styles: getDefaultStyles(sectionType),
      order: storeConfig.sections.length
    };

    setStoreConfig(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const getDefaultContent = (sectionType: string) => {
    switch (sectionType) {
      case 'hero':
        return {
          title: 'Welcome to Our Store',
          subtitle: 'Discover amazing products at great prices',
          buttonText: 'Shop Now',
          backgroundImage: '',
          alignment: 'center'
        };
      case 'products':
        return {
          title: 'Our Products',
          columns: 4,
          showFilters: true,
          showSorting: true,
          productsPerPage: 12
        };
      case 'featured':
        return {
          title: 'Featured Products',
          products: [],
          layout: 'carousel'
        };
      case 'testimonials':
        return {
          title: 'What Our Customers Say',
          testimonials: [
            {
              name: 'John Doe',
              text: 'Amazing products and great service!',
              rating: 5,
              image: ''
            }
          ]
        };
      case 'about':
        return {
          title: 'About Us',
          text: 'We are passionate about providing high-quality products...',
          image: '',
          features: ['Quality Products', 'Fast Shipping', 'Great Support']
        };
      default:
        return {};
    }
  };

  const getDefaultStyles = (sectionType: string) => {
    return {
      backgroundColor: '#FFFFFF',
      textColor: '#111827',
      padding: '4rem 0',
      textAlign: 'center'
    };
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(storeConfig.sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    setStoreConfig(prev => ({
      ...prev,
      sections: updatedItems
    }));
  };

  const updateSection = (sectionId: string, updates: Partial<StoreSection>) => {
    setStoreConfig(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    }));
  };

  const deleteSection = (sectionId: string) => {
    setStoreConfig(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
  };

  const duplicateSection = (sectionId: string) => {
    const section = storeConfig.sections.find(s => s.id === sectionId);
    if (section) {
      const newSection = {
        ...section,
        id: `section-${Date.now()}`,
        name: `${section.name} (Copy)`,
        order: storeConfig.sections.length
      };
      setStoreConfig(prev => ({
        ...prev,
        sections: [...prev.sections, newSection]
      }));
    }
  };

  const saveStore = async () => {
    try {
      const response = await fetch('/api/store-builder/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(storeConfig)
      });

      if (response.ok) {
        alert('Store saved successfully!');
      } else {
        alert('Failed to save store');
      }
    } catch (error) {
      console.error('Error saving store:', error);
      alert('Error saving store');
    }
  };

  const publishStore = async () => {
    try {
      const response = await fetch('/api/store-builder/stores/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ storeId: selectedTemplate, config: storeConfig })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Store published successfully! URL: ${result.url}`);
      } else {
        alert('Failed to publish store');
      }
    } catch (error) {
      console.error('Error publishing store:', error);
      alert('Error publishing store');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Store className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Store Builder</h1>
              <p className="text-sm text-gray-600">Create your professional online store</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`p-2 rounded ${previewMode === 'desktop' ? 'bg-white shadow-sm' : ''}`}
              >
                <Monitor className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPreviewMode('tablet')}
                className={`p-2 rounded ${previewMode === 'tablet' ? 'bg-white shadow-sm' : ''}`}
              >
                <Tablet className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`p-2 rounded ${previewMode === 'mobile' ? 'bg-white shadow-sm' : ''}`}
              >
                <Smartphone className="h-4 w-4" />
              </button>
            </div>
            
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </button>
            
            <button
              onClick={saveStore}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
            
            <button
              onClick={publishStore}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Upload className="h-4 w-4" />
              <span>Publish</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
              <button
                onClick={() => setActiveTab('templates')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'templates'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Templates
              </button>
              <button
                onClick={() => setActiveTab('sections')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'sections'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sections
              </button>
              <button
                onClick={() => setActiveTab('design')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'design'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Design
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Settings
              </button>
            </div>

            {/* Templates Tab */}
            {activeTab === 'templates' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Choose Template</h3>
                <div className="space-y-3">
                  {storeTemplates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => handleTemplateSelect(template.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedTemplate === template.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="aspect-video bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                      <div className="flex items-center space-x-1 mb-2">
                        {template.colors.map((color, index) => (
                          <d
(Content truncated due to size limit. Use line ranges to read in chunks)
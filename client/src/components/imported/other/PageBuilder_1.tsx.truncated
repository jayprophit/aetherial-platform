import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  Layout, 
  Type, 
  Image as ImageIcon, 
  Video, 
  Button as ButtonIcon, 
  Grid, 
  Columns, 
  Plus, 
  Trash2, 
  Copy, 
  Settings, 
  Eye, 
  Save, 
  Upload,
  Palette,
  Code,
  Monitor,
  Smartphone,
  Tablet,
  Layers,
  Move,
  Edit3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Link,
  List,
  Quote,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react';

interface PageElement {
  id: string;
  type: string;
  name: string;
  content: any;
  styles: any;
  children?: PageElement[];
  parentId?: string;
}

interface PageConfig {
  id: string;
  name: string;
  slug: string;
  title: string;
  description: string;
  theme: string;
  elements: PageElement[];
  globalStyles: {
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
    spacing: {
      container: string;
      section: string;
    };
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogImage: string;
  };
  customCSS: string;
  customJS: string;
}

interface ElementType {
  id: string;
  name: string;
  icon: any;
  category: string;
  description: string;
  defaultContent: any;
  defaultStyles: any;
  allowChildren?: boolean;
}

const PageBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState('elements');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [pageConfig, setPageConfig] = useState<PageConfig>({
    id: 'page-1',
    name: 'New Page',
    slug: 'new-page',
    title: 'New Page',
    description: 'A new page created with the page builder',
    theme: 'modern-light',
    elements: [],
    globalStyles: {
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
      spacing: {
        container: '1200px',
        section: '4rem'
      }
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: [],
      ogImage: ''
    },
    customCSS: '',
    customJS: ''
  });
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [draggedElement, setDraggedElement] = useState<ElementType | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const elementTypes: ElementType[] = [
    // Layout Elements
    {
      id: 'container',
      name: 'Container',
      icon: Layout,
      category: 'Layout',
      description: 'Main container for content',
      allowChildren: true,
      defaultContent: { maxWidth: '1200px' },
      defaultStyles: { padding: '2rem', margin: '0 auto' }
    },
    {
      id: 'section',
      name: 'Section',
      icon: Layers,
      category: 'Layout',
      description: 'Content section with background',
      allowChildren: true,
      defaultContent: {},
      defaultStyles: { padding: '4rem 0', backgroundColor: '#FFFFFF' }
    },
    {
      id: 'row',
      name: 'Row',
      icon: Grid,
      category: 'Layout',
      description: 'Horizontal row container',
      allowChildren: true,
      defaultContent: { columns: 1 },
      defaultStyles: { display: 'flex', gap: '1rem' }
    },
    {
      id: 'column',
      name: 'Column',
      icon: Columns,
      category: 'Layout',
      description: 'Column within a row',
      allowChildren: true,
      defaultContent: { width: '100%' },
      defaultStyles: { flex: '1' }
    },

    // Content Elements
    {
      id: 'heading',
      name: 'Heading',
      icon: Heading1,
      category: 'Content',
      description: 'Text heading (H1-H6)',
      defaultContent: { text: 'Your Heading Here', level: 'h1' },
      defaultStyles: { fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }
    },
    {
      id: 'paragraph',
      name: 'Paragraph',
      icon: Type,
      category: 'Content',
      description: 'Text paragraph',
      defaultContent: { text: 'Your paragraph text goes here. You can edit this content to match your needs.' },
      defaultStyles: { fontSize: '1rem', lineHeight: '1.6', color: '#374151', marginBottom: '1rem' }
    },
    {
      id: 'button',
      name: 'Button',
      icon: ButtonIcon,
      category: 'Content',
      description: 'Call-to-action button',
      defaultContent: { text: 'Click Me', link: '#', style: 'primary' },
      defaultStyles: { 
        padding: '0.75rem 1.5rem', 
        backgroundColor: '#3B82F6', 
        color: '#FFFFFF', 
        borderRadius: '0.5rem',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '500'
      }
    },
    {
      id: 'image',
      name: 'Image',
      icon: ImageIcon,
      category: 'Media',
      description: 'Image with alt text',
      defaultContent: { 
        src: 'https://via.placeholder.com/600x400', 
        alt: 'Placeholder image',
        caption: ''
      },
      defaultStyles: { width: '100%', height: 'auto', borderRadius: '0.5rem' }
    },
    {
      id: 'video',
      name: 'Video',
      icon: Video,
      category: 'Media',
      description: 'Video player',
      defaultContent: { 
        src: '', 
        poster: 'https://via.placeholder.com/600x400',
        autoplay: false,
        controls: true
      },
      defaultStyles: { width: '100%', height: 'auto', borderRadius: '0.5rem' }
    },

    // Form Elements
    {
      id: 'form',
      name: 'Contact Form',
      icon: Edit3,
      category: 'Forms',
      description: 'Contact form with fields',
      allowChildren: true,
      defaultContent: { 
        action: '/contact',
        method: 'POST',
        fields: [
          { type: 'text', name: 'name', label: 'Name', required: true },
          { type: 'email', name: 'email', label: 'Email', required: true },
          { type: 'textarea', name: 'message', label: 'Message', required: true }
        ]
      },
      defaultStyles: { padding: '2rem', backgroundColor: '#F9FAFB', borderRadius: '0.5rem' }
    },
    {
      id: 'newsletter',
      name: 'Newsletter',
      icon: Plus,
      category: 'Forms',
      description: 'Email subscription form',
      defaultContent: { 
        title: 'Subscribe to our newsletter',
        description: 'Get the latest updates and news',
        placeholder: 'Enter your email',
        buttonText: 'Subscribe'
      },
      defaultStyles: { 
        padding: '2rem', 
        backgroundColor: '#EFF6FF', 
        borderRadius: '0.5rem',
        textAlign: 'center'
      }
    },

    // Advanced Elements
    {
      id: 'gallery',
      name: 'Image Gallery',
      icon: Grid,
      category: 'Media',
      description: 'Image gallery grid',
      defaultContent: { 
        images: [
          { src: 'https://via.placeholder.com/300x200', alt: 'Gallery image 1' },
          { src: 'https://via.placeholder.com/300x200', alt: 'Gallery image 2' },
          { src: 'https://via.placeholder.com/300x200', alt: 'Gallery image 3' }
        ],
        columns: 3
      },
      defaultStyles: { display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(3, 1fr)' }
    },
    {
      id: 'testimonial',
      name: 'Testimonial',
      icon: Quote,
      category: 'Content',
      description: 'Customer testimonial',
      defaultContent: { 
        quote: 'This is an amazing product that has transformed our business.',
        author: 'John Doe',
        position: 'CEO, Company Inc.',
        avatar: 'https://via.placeholder.com/80x80'
      },
      defaultStyles: { 
        padding: '2rem', 
        backgroundColor: '#F9FAFB', 
        borderRadius: '0.5rem',
        textAlign: 'center',
        borderLeft: '4px solid #3B82F6'
      }
    },
    {
      id: 'spacer',
      name: 'Spacer',
      icon: Move,
      category: 'Layout',
      description: 'Empty space for layout',
      defaultContent: { height: '2rem' },
      defaultStyles: { height: '2rem', width: '100%' }
    },
    {
      id: 'divider',
      name: 'Divider',
      icon: Underline,
      category: 'Layout',
      description: 'Horizontal line divider',
      defaultContent: { style: 'solid' },
      defaultStyles: { 
        height: '1px', 
        backgroundColor: '#E5E7EB', 
        margin: '2rem 0',
        border: 'none'
      }
    },
    {
      id: 'code',
      name: 'Code Block',
      icon: Code,
      category: 'Content',
      description: 'Syntax highlighted code',
      defaultContent: { 
        code: 'console.log("Hello, World!");',
        language: 'javascript'
      },
      defaultStyles: { 
        backgroundColor: '#1F2937', 
        color: '#F9FAFB', 
        padding: '1rem',
        borderRadius: '0.5rem',
        fontFamily: 'monospace',
        overflow: 'auto'
      }
    }
  ];

  const themes = [
    {
      id: 'modern-light',
      name: 'Modern Light',
      colors: {
        primary: '#3B82F6',
        secondary: '#1F2937',
        accent: '#F59E0B',
        background: '#FFFFFF',
        text: '#111827'
      }
    },
    {
      id: 'dark-professional',
      name: 'Dark Professional',
      colors: {
        primary: '#6366F1',
        secondary: '#4F46E5',
        accent: '#EC4899',
        background: '#111827',
        text: '#F9FAFB'
      }
    },
    {
      id: 'colorful-creative',
      name: 'Colorful Creative',
      colors: {
        primary: '#EC4899',
        secondary: '#8B5CF6',
        accent: '#F59E0B',
        background: '#FEFEFE',
        text: '#1F2937'
      }
    }
  ];

  const addElement = (elementType: ElementType, parentId?: string) => {
    const newElement: PageElement = {
      id: `element-${Date.now()}`,
      type: elementType.id,
      name: elementType.name,
      content: { ...elementType.defaultContent },
      styles: { ...elementType.defaultStyles },
      children: elementType.allowChildren ? [] : undefined,
      parentId
    };

    setPageConfig(prev => ({
      ...prev,
      elements: parentId 
        ? addElementToParent(prev.elements, parentId, newElement)
        : [...prev.elements, newElement]
    }));

    setSelectedElement(newElement.id);
  };

  const addElementToParent = (elements: PageElement[], parentId: string, newElement: PageElement): PageElement[] => {
    return elements.map(element => {
      if (element.id === parentId && element.children) {
        return {
          ...element,
          children: [...element.children, newElement]
        };
      } else if (element.children) {
        return {
          ...element,
          children: addElementToParent(element.children, parentId, newElement)
        };
      }
      return element;
    });
  };

  const updateElement = (elementId: string, updates: Partial<PageElement>) => {
    setPageConfig(prev => ({
      ...prev,
      elements: updateElementInTree(prev.elements, elementId, updates)
    }));
  };

  const updateElementInTree = (elements: PageElement[], elementId: string, updates: Partial<PageElement>): PageElement[] => {
    return elements.map(element => {
      if (element.id === elementId) {
        return { ...element, ...updates };
      } else if (element.children) {
        return {
          ...element,
          children: updateElementInTree(element.children, elementId, updates)
        };
      }
      return element;
    });
  };

  const deleteElement = (elementId: string) => {
    setPageConfig(prev => ({
      ...prev,
      elements: deleteElementFromTree(prev.elements, elementId)
    }));
    setSelectedElement(null);
  };

  const deleteElementFromTree = (elements: PageElement[], elementId: string): PageElement[] => {
    return elements.filter(element => {
      if (element.id === elementId) {
        return false;
      } else if (element.children) {
        element.children = deleteElementFromTree(element.children, elementId);
      }
      return true;
    });
  };

  const duplicateElement = (elementId: string) => {
    const element = findElementInTree(pageConfig.elements, elementId);
    if (element) {
      const duplicatedElement = {
        ...element,
        id: `element-${Date.now()}`,
        name: `${element.name} (Copy)`
      };
      
      setPageConfig(prev => ({
        ...prev,
        elements: [...prev.elements, duplicatedElement]
      }));
    }
  };

  const findElementInTree = (elements: PageElement[], elementId: string): PageElement | null => {
    for (const element of elements) {
      if (element.id === elementId) {
        return element;
      } else if (element.children) {
        const found = findElementInTree(element.children, elementId);
        if (found) return found;
      }
    }
    return null;
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    // Handle reordering elements
    if (source.droppableId === destination.droppableId) {
      const items = Array.from(pageConfig.elements);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      setPageConfig(prev => ({
        ...prev,
        elements: items
      }));
    }
  };

  const savePage = async () => {
    try {
      const response = await fetch('/api/page-builder/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(pageConfig)
      });

      if (response.ok) {
        alert('Page saved successfully!');
      } else {
        alert('Failed to save page');
      }
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Error saving page');
    }
  };

  const publishPage = async () => {
    try {
      const response = await fetch('/api/page-builder/pages/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ pageId: pageConfig.id, config: pageConfig })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Page published successfully! URL: ${result.url}`);
      } else {
        alert('Failed to publish page');
      }
    } catch (error) {
      console.error('Error publishing page:', error);
      alert('Error publishing page');
    }
  };

  const selectedElementData = selectedElement ? findElementInTree(pageConfig.elements, selectedElement) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Layout className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Page Builder</h1>
              <p className="text-sm text-gray-600">Create stunning pages with drag & drop</p>
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
                className={`p-2 rounded ${previewMode === 'tablet' ? 'bg-whit
(Content truncated due to size limit. Use line ranges to read in chunks)
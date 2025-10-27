export interface DocItem {
  id: string;
  title: string;
  file: string;
  category: 'core' | 'chat' | 'other';
  description: string;
}

export const docs: DocItem[] = [
  {
    id: 'index',
    title: 'Index & Navigation',
    file: 'INDEX.md',
    category: 'core',
    description: 'Master index and navigation guide for all documents'
  },
  {
    id: 'executive-summary',
    title: 'Executive Summary',
    file: 'EXECUTIVE_SUMMARY.md',
    category: 'core',
    description: 'High-level project overview and recommendations'
  },
  {
    id: 'deep-analysis',
    title: 'Deep Analysis',
    file: 'DEEP_ANALYSIS.md',
    category: 'core',
    description: 'Detailed analysis of 19 chat sessions'
  },
  {
    id: 'reconstruction',
    title: 'Project Reconstruction',
    file: 'COMPREHENSIVE_PROJECT_RECONSTRUCTION.md',
    category: 'core',
    description: 'Complete chronological project history'
  },
  {
    id: 'roadmap',
    title: 'Implementation Roadmap',
    file: 'IMPLEMENTATION_ROADMAP.md',
    category: 'core',
    description: '8-phase implementation plan (28 weeks)'
  },
  {
    id: 'technical-spec',
    title: 'Technical Specification',
    file: 'TECHNICAL_SPECIFICATION.md',
    category: 'core',
    description: 'Complete system architecture and specifications'
  },
  {
    id: 'todo',
    title: 'TODO List',
    file: 'TODO.md',
    category: 'core',
    description: 'Comprehensive task checklist'
  },
  {
    id: 'chat-01',
    title: 'Chat 01: Build Website',
    file: 'chat_01_build_website.md',
    category: 'chat',
    description: 'Initial website build request'
  },
  {
    id: 'chat-02',
    title: 'Chat 02: Link Shared Content',
    file: 'chat_02_link_shared_content.md',
    category: 'chat',
    description: 'Linking shared content'
  },
  {
    id: 'chat-03',
    title: 'Chat 03: Build Platform',
    file: 'chat_03_build_platform_provided_info.md',
    category: 'chat',
    description: 'Building platform with provided information'
  },
  {
    id: 'chat-05',
    title: 'Chat 05: Claude Project Link',
    file: 'chat_05_claude_project_link.md',
    category: 'chat',
    description: 'Claude project integration'
  },
  {
    id: 'chat-06',
    title: 'Chat 06: Production Build',
    file: 'chat_06_building_platform_production.md',
    category: 'chat',
    description: 'Building platform for production'
  },
  {
    id: 'chat-07',
    title: 'Chat 07: Existing Info',
    file: 'chat_07_building_from_existing_info.md',
    category: 'chat',
    description: 'Building from existing information'
  },
  {
    id: 'chat-08',
    title: 'Chat 08: Auth & AI',
    file: 'chat_08_auth_and_ai_enhancement.md',
    category: 'chat',
    description: 'Authentication and AI enhancement'
  },
  {
    id: 'chat-09',
    title: 'Chat 09: Advanced AI & Enterprise',
    file: 'chat_09_advanced_ai_laas_paas_saas.md',
    category: 'chat',
    description: 'Advanced AI, LaaS/PaaS/SaaS implementation'
  },
  {
    id: 'chat-10-19',
    title: 'Chat 10-19: Summary',
    file: 'chat_10_to_19_summary.md',
    category: 'chat',
    description: 'Summary of remaining chat sessions'
  }
];

export function getDocById(id: string): DocItem | undefined {
  return docs.find(doc => doc.id === id);
}

export function getDocsByCategory(category: 'core' | 'chat' | 'other'): DocItem[] {
  return docs.filter(doc => doc.category === category);
}


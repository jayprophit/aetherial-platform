import React, { useState } from 'react';
import { LeftSidebar } from '../components/layout/LeftSidebar';
import { AIChatPanel } from '../components/layout/AIChatPanel';
import { MainContent } from '../components/layout/MainContent';
import { MediaBrowser } from '../components/layout/MediaBrowser';
import { TopBar } from '../components/layout/TopBar';
import './MainLayout.css';

interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [aiPanelVisible, setAiPanelVisible] = useState(true);
  const [mediaBrowserVisible, setMediaBrowserVisible] = useState(true);
  const [currentModule, setCurrentModule] = useState('dashboard');

  return (
    <div className="main-layout">
      {/* Top Bar with submenu icons */}
      <TopBar 
        onToggleLeftSidebar={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
        onToggleAIPanel={() => setAiPanelVisible(!aiPanelVisible)}
        onToggleMediaBrowser={() => setMediaBrowserVisible(!mediaBrowserVisible)}
      />

      <div className="layout-body">
        {/* Left Sidebar - Main Menu with Icons */}
        <LeftSidebar 
          collapsed={leftSidebarCollapsed}
          onModuleChange={setCurrentModule}
          currentModule={currentModule}
        />

        {/* AI/Chat/3D Avatar Panel */}
        {aiPanelVisible && (
          <AIChatPanel />
        )}

        {/* Main Content Area */}
        <MainContent module={currentModule}>
          {children}
        </MainContent>

        {/* Right Panel - Media Browser */}
        {mediaBrowserVisible && (
          <MediaBrowser />
        )}
      </div>
    </div>
  );
};


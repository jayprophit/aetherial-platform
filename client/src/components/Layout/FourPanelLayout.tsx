/**
 * AETHERIAL Platform - 4-Panel Responsive Layout
 * 
 * Layout Structure:
 * [Left Sidebar] [Main Content] [AI Chat Panel] [Media Browser]
 * 
 * Features:
 * - Fully responsive (desktop, tablet, mobile, smartwatch)
 * - Collapsible panels with burger menu
 * - Cascading dropdown menus
 * - Touch gestures and keyboard shortcuts
 * - Adaptive to screen size and device type
 */

import React, { useState, useEffect, useCallback } from 'react';
import { mainMenu, getTopBarActions, getOverflowActions, MenuItem, TopBarAction } from '../../config/menu-structure';
import LeftSidebar from './LeftSidebar';
import TopBar from './TopBar';
import AIChatPanel from './AIChatPanel';
import MediaBrowser from './MediaBrowser';
import './FourPanelLayout.css';

interface DeviceInfo {
  type: 'smartwatch' | 'mobile' | 'tablet' | 'desktop';
  screenWidth: number;
  screenHeight: number;
  isTouch: boolean;
  isRetina: boolean;
  orientation: 'portrait' | 'landscape';
}

interface PanelState {
  leftSidebar: boolean;
  aiChat: boolean;
  mediaBrowser: boolean;
}

export default function FourPanelLayout({ children }: { children: React.ReactNode }) {
  // Device detection
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    type: 'desktop',
    screenWidth: typeof window !== 'undefined' ? window.innerWidth : 1920,
    screenHeight: typeof window !== 'undefined' ? window.innerHeight : 1080,
    isTouch: false,
    isRetina: false,
    orientation: 'landscape',
  });

  // Panel visibility states
  const [panelState, setPanelState] = useState<PanelState>({
    leftSidebar: true,
    aiChat: true,
    mediaBrowser: true,
  });

  // Current active menu item
  const [activeMenuItem, setActiveMenuItem] = useState<string>('dashboard');

  // Top bar actions based on active menu
  const [topBarActions, setTopBarActions] = useState<TopBarAction[]>([]);

  /**
   * Detect device type and capabilities
   */
  const detectDevice = useCallback((): DeviceInfo => {
    if (typeof window === 'undefined') {
      return deviceInfo;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isRetina = window.devicePixelRatio > 1;
    const orientation = width > height ? 'landscape' : 'portrait';

    let type: DeviceInfo['type'] = 'desktop';
    
    if (width < 320) {
      type = 'smartwatch';
    } else if (width < 768) {
      type = 'mobile';
    } else if (width < 1025) {
      type = 'tablet';
    } else {
      type = 'desktop';
    }

    return {
      type,
      screenWidth: width,
      screenHeight: height,
      isTouch,
      isRetina,
      orientation,
    };
  }, []);

  /**
   * Get default panel states based on device type
   */
  const getDefaultPanelState = useCallback((device: DeviceInfo): PanelState => {
    switch (device.type) {
      case 'smartwatch':
        return { leftSidebar: false, aiChat: false, mediaBrowser: false };
      case 'mobile':
        return { leftSidebar: false, aiChat: false, mediaBrowser: false };
      case 'tablet':
        return { leftSidebar: false, aiChat: false, mediaBrowser: false };
      case 'desktop':
      default:
        return { leftSidebar: true, aiChat: true, mediaBrowser: true };
    }
  }, []);

  /**
   * Handle window resize
   */
  useEffect(() => {
    const handleResize = () => {
      const newDeviceInfo = detectDevice();
      setDeviceInfo(newDeviceInfo);
      
      // Auto-adjust panel states based on device type
      const defaultState = getDefaultPanelState(newDeviceInfo);
      setPanelState(defaultState);
    };

    // Initial detection
    handleResize();

    // Listen for resize events
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [detectDevice, getDefaultPanelState]);

  /**
   * Update top bar actions when active menu changes
   */
  useEffect(() => {
    const actions = getTopBarActions(activeMenuItem);
    setTopBarActions(actions);
  }, [activeMenuItem]);

  /**
   * Toggle panel visibility
   */
  const togglePanel = (panel: keyof PanelState) => {
    setPanelState(prev => ({
      ...prev,
      [panel]: !prev[panel],
    }));
  };

  /**
   * Handle menu item selection
   */
  const handleMenuSelect = (menuId: string) => {
    setActiveMenuItem(menuId);
    
    // On mobile/tablet, close left sidebar after selection
    if (deviceInfo.type === 'mobile' || deviceInfo.type === 'tablet') {
      setPanelState(prev => ({ ...prev, leftSidebar: false }));
    }
  };

  /**
   * Handle keyboard shortcuts
   */
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      // Ctrl/Cmd + B: Toggle left sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        togglePanel('leftSidebar');
      }
      // Ctrl/Cmd + I: Toggle AI chat
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        togglePanel('aiChat');
      }
      // Ctrl/Cmd + M: Toggle media browser
      if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        togglePanel('mediaBrowser');
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, []);

  /**
   * Handle touch gestures (swipe to open/close panels)
   */
  useEffect(() => {
    if (!deviceInfo.isTouch) return;

    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      
      // Horizontal swipe (ignore if vertical swipe is dominant)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        // Swipe right from left edge: Open left sidebar
        if (touchStartX < 50 && deltaX > 0) {
          setPanelState(prev => ({ ...prev, leftSidebar: true }));
        }
        // Swipe left: Close left sidebar
        if (deltaX < 0 && panelState.leftSidebar) {
          setPanelState(prev => ({ ...prev, leftSidebar: false }));
        }
        // Swipe left from right edge: Open AI chat
        if (touchStartX > deviceInfo.screenWidth - 50 && deltaX < 0) {
          setPanelState(prev => ({ ...prev, aiChat: true }));
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [deviceInfo, panelState]);

  /**
   * Get layout classes based on device and panel states
   */
  const getLayoutClasses = () => {
    const classes = ['four-panel-layout', `device-${deviceInfo.type}`, `orientation-${deviceInfo.orientation}`];
    
    if (panelState.leftSidebar) classes.push('left-sidebar-open');
    if (panelState.aiChat) classes.push('ai-chat-open');
    if (panelState.mediaBrowser) classes.push('media-browser-open');
    if (deviceInfo.isRetina) classes.push('retina');
    if (deviceInfo.isTouch) classes.push('touch-device');
    
    return classes.join(' ');
  };

  return (
    <div className={getLayoutClasses()}>
      {/* Top Bar */}
      <TopBar
        deviceInfo={deviceInfo}
        activeMenuItem={activeMenuItem}
        topBarActions={topBarActions}
        onToggleLeftSidebar={() => togglePanel('leftSidebar')}
        onToggleAIChat={() => togglePanel('aiChat')}
        onToggleMediaBrowser={() => togglePanel('mediaBrowser')}
      />

      {/* Main Layout Container */}
      <div className="layout-container">
        {/* Left Sidebar - Main Navigation */}
        <LeftSidebar
          isOpen={panelState.leftSidebar}
          deviceInfo={deviceInfo}
          menuItems={mainMenu}
          activeMenuItem={activeMenuItem}
          onMenuSelect={handleMenuSelect}
          onClose={() => togglePanel('leftSidebar')}
        />

        {/* Main Content Area */}
        <main className="main-content">
          {children}
        </main>

        {/* Right Sidebar #1 - AI Chat Panel */}
        <AIChatPanel
          isOpen={panelState.aiChat}
          deviceInfo={deviceInfo}
          onClose={() => togglePanel('aiChat')}
        />

        {/* Right Sidebar #2 - Media Browser */}
        <MediaBrowser
          isOpen={panelState.mediaBrowser}
          deviceInfo={deviceInfo}
          onClose={() => togglePanel('mediaBrowser')}
        />
      </div>

      {/* Overlay for mobile/tablet when panels are open */}
      {(deviceInfo.type === 'mobile' || deviceInfo.type === 'tablet') && 
       (panelState.leftSidebar || panelState.aiChat || panelState.mediaBrowser) && (
        <div 
          className="panel-overlay"
          onClick={() => setPanelState({ leftSidebar: false, aiChat: false, mediaBrowser: false })}
        />
      )}

      {/* Device Info Debug (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="device-debug">
          {deviceInfo.type} | {deviceInfo.screenWidth}x{deviceInfo.screenHeight} | 
          {deviceInfo.orientation} | {deviceInfo.isTouch ? 'Touch' : 'Mouse'}
        </div>
      )}
    </div>
  );
}


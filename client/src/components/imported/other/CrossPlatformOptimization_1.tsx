import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { 
  Smartphone, Tablet, Monitor, Watch, Headphones, Gamepad2,
  Wifi, Battery, Signal, Bluetooth, Volume2, Brightness,
  Settings, Download, Share, Maximize, Minimize, RotateCcw,
  Zap, Cpu, HardDrive, Memory, Gpu, Thermometer, Activity,
  Globe, MapPin, Clock, Calendar, User, Bell, Search, Menu,
  Home, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Plus, Minus,
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat,
  Camera, Mic, Video, Image, FileText, Folder, Archive,
  Cloud, Server, Database, Code, Terminal, Git, Package
} from 'lucide-react';

// Device Detection Hook
const useDeviceDetection = () => {
  const [device, setDevice] = useState({
    type: 'desktop',
    os: 'unknown',
    browser: 'unknown',
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    hasTouch: false,
    orientation: 'landscape',
    screenSize: { width: 1920, height: 1080 },
    pixelRatio: 1,
    connection: 'unknown',
    battery: null,
    memory: null,
    cores: null
  });

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Device type detection
      let deviceType = 'desktop';
      let isMobile = false;
      let isTablet = false;
      let isDesktop = true;

      if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
        if (width < 768) {
          deviceType = 'mobile';
          isMobile = true;
          isDesktop = false;
        } else {
          deviceType = 'tablet';
          isTablet = true;
          isDesktop = false;
        }
      } else if (width < 768) {
        deviceType = 'mobile';
        isMobile = true;
        isDesktop = false;
      } else if (width < 1024) {
        deviceType = 'tablet';
        isTablet = true;
        isDesktop = false;
      }

      // OS detection
      let os = 'unknown';
      if (/Windows/i.test(userAgent)) os = 'windows';
      else if (/Mac/i.test(userAgent)) os = 'macos';
      else if (/Linux/i.test(userAgent)) os = 'linux';
      else if (/Android/i.test(userAgent)) os = 'android';
      else if (/iPhone|iPad|iPod/i.test(userAgent)) os = 'ios';

      // Browser detection
      let browser = 'unknown';
      if (/Chrome/i.test(userAgent)) browser = 'chrome';
      else if (/Firefox/i.test(userAgent)) browser = 'firefox';
      else if (/Safari/i.test(userAgent)) browser = 'safari';
      else if (/Edge/i.test(userAgent)) browser = 'edge';

      // Touch support
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Orientation
      const orientation = width > height ? 'landscape' : 'portrait';

      // Connection info
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      
      // Hardware info
      const memory = (navigator as any).deviceMemory;
      const cores = navigator.hardwareConcurrency;

      setDevice({
        type: deviceType,
        os,
        browser,
        isMobile,
        isTablet,
        isDesktop,
        hasTouch,
        orientation,
        screenSize: { width, height },
        pixelRatio: window.devicePixelRatio || 1,
        connection: connection?.effectiveType || 'unknown',
        battery: null,
        memory,
        cores
      });
    };

    detectDevice();
    window.addEventListener('resize', detectDevice);
    window.addEventListener('orientationchange', detectDevice);

    // Battery API
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setDevice(prev => ({
          ...prev,
          battery: {
            level: battery.level,
            charging: battery.charging,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime
          }
        }));
      });
    }

    return () => {
      window.removeEventListener('resize', detectDevice);
      window.removeEventListener('orientationchange', detectDevice);
    };
  }, []);

  return device;
};

// Responsive Grid Component
interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: number;
  className?: string;
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 4,
  className = ''
}) => {
  const device = useDeviceDetection();
  
  const getColumns = () => {
    if (device.isMobile) return columns.mobile || 1;
    if (device.isTablet) return columns.tablet || 2;
    return columns.desktop || 3;
  };

  const gridColumns = getColumns();

  return (
    <div
      className={`grid gap-${gap} ${className}`}
      style={{
        gridTemplateColumns: `repeat(${gridColumns}, 1fr)`
      }}
    >
      {children}
    </div>
  );
};

// Adaptive Layout Component
interface AdaptiveLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  layout?: 'default' | 'sidebar-left' | 'sidebar-right' | 'full-width';
}

const AdaptiveLayout: React.FC<AdaptiveLayoutProps> = ({
  children,
  sidebar,
  header,
  footer,
  layout = 'default'
}) => {
  const device = useDeviceDetection();
  const [sidebarOpen, setSidebarOpen] = useState(!device.isMobile);

  useEffect(() => {
    setSidebarOpen(!device.isMobile);
  }, [device.isMobile]);

  const layoutClasses = {
    default: 'flex flex-col min-h-screen',
    'sidebar-left': 'flex flex-col lg:flex-row min-h-screen',
    'sidebar-right': 'flex flex-col lg:flex-row-reverse min-h-screen',
    'full-width': 'flex flex-col min-h-screen'
  };

  return (
    <div className={layoutClasses[layout]}>
      {/* Header */}
      {header && (
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-50 bg-white shadow-sm border-b"
        >
          <div className="flex items-center justify-between px-4 py-3">
            {header}
            {sidebar && device.isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu size={20} />
              </button>
            )}
          </div>
        </motion.header>
      )}

      <div className="flex flex-1">
        {/* Sidebar */}
        {sidebar && (
          <AnimatePresence>
            {(sidebarOpen || !device.isMobile) && (
              <motion.aside
                initial={{ x: device.isMobile ? -300 : 0, opacity: device.isMobile ? 0 : 1 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: device.isMobile ? -300 : 0, opacity: device.isMobile ? 0 : 1 }}
                className={`
                  ${device.isMobile ? 'fixed inset-y-0 left-0 z-40 w-64' : 'w-64 flex-shrink-0'}
                  bg-white border-r overflow-y-auto
                `}
              >
                {device.isMobile && (
                  <div className="flex items-center justify-between p-4 border-b">
                    <span className="font-semibold">Menu</span>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      <ArrowLeft size={20} />
                    </button>
                  </div>
                )}
                <div className="p-4">
                  {sidebar}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        )}

        {/* Mobile Overlay */}
        {device.isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-30"
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      {footer && (
        <motion.footer
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gray-50 border-t"
        >
          <div className="px-4 py-6">
            {footer}
          </div>
        </motion.footer>
      )}
    </div>
  );
};

// Touch-Optimized Button Component
interface TouchButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'touch';
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const TouchButton: React.FC<TouchButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  icon,
  className = ''
}) => {
  const device = useDeviceDetection();
  
  // Adjust size for touch devices
  const touchSize = device.hasTouch ? 'touch' : size;
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm min-h-[32px]',
    md: 'px-4 py-2 text-base min-h-[40px]',
    lg: 'px-6 py-3 text-lg min-h-[48px]',
    touch: 'px-6 py-4 text-base min-h-[44px]' // iOS recommended touch target
  };

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100',
    ghost: 'text-blue-600 hover:bg-blue-50 active:bg-blue-100'
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center font-medium rounded-lg
        transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[touchSize]} ${variantClasses[variant]} ${className}
        ${device.hasTouch ? 'select-none' : ''}
      `}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>
  );
};

// Device Status Component
const DeviceStatus: React.FC = () => {
  const device = useDeviceDetection();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getDeviceIcon = () => {
    switch (device.type) {
      case 'mobile': return <Smartphone size={16} />;
      case 'tablet': return <Tablet size={16} />;
      default: return <Monitor size={16} />;
    }
  };

  const getConnectionIcon = () => {
    switch (device.connection) {
      case '4g': return <Signal className="text-green-500" size={16} />;
      case '3g': return <Signal className="text-yellow-500" size={16} />;
      case '2g': return <Signal className="text-red-500" size={16} />;
      default: return <Wifi size={16} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border p-4"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        {getDeviceIcon()}
        <span className="ml-2">Device Status</span>
      </h3>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-600">Device Type</div>
          <div className="font-medium capitalize">{device.type}</div>
        </div>
        
        <div>
          <div className="text-gray-600">Operating System</div>
          <div className="font-medium capitalize">{device.os}</div>
        </div>
        
        <div>
          <div className="text-gray-600">Browser</div>
          <div className="font-medium capitalize">{device.browser}</div>
        </div>
        
        <div>
          <div className="text-gray-600">Screen Size</div>
          <div className="font-medium">
            {device.screenSize.width} × {device.screenSize.height}
          </div>
        </div>
        
        <div>
          <div className="text-gray-600">Orientation</div>
          <div className="font-medium capitalize">{device.orientation}</div>
        </div>
        
        <div>
          <div className="text-gray-600">Touch Support</div>
          <div className="font-medium">{device.hasTouch ? 'Yes' : 'No'}</div>
        </div>
        
        <div>
          <div className="text-gray-600">Connection</div>
          <div className="font-medium flex items-center">
            {getConnectionIcon()}
            <span className="ml-1 capitalize">{device.connection}</span>
          </div>
        </div>
        
        <div>
          <div className="text-gray-600">Pixel Ratio</div>
          <div className="font-medium">{device.pixelRatio}x</div>
        </div>
        
        {device.memory && (
          <div>
            <div className="text-gray-600">Memory</div>
            <div className="font-medium">{device.memory} GB</div>
          </div>
        )}
        
        {device.cores && (
          <div>
            <div className="text-gray-600">CPU Cores</div>
            <div className="font-medium">{device.cores}</div>
          </div>
        )}
        
        {device.battery && (
          <div>
            <div className="text-gray-600">Battery</div>
            <div className="font-medium flex items-center">
              <Battery 
                size={16} 
                className={device.battery.charging ? 'text-green-500' : 'text-gray-500'} 
              />
              <span className="ml-1">{Math.round(device.battery.level * 100)}%</span>
            </div>
          </div>
        )}
        
        <div>
          <div className="text-gray-600">Current Time</div>
          <div className="font-medium">{time.toLocaleTimeString()}</div>
        </div>
      </div>
    </motion.div>
  );
};

// Performance Monitor Component
const PerformanceMonitor: React.FC = () => {
  const [performance, setPerformance] = useState({
    fps: 60,
    memory: 0,
    loadTime: 0,
    renderTime: 0,
    networkLatency: 0
  });

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        setPerformance(prev => ({
          ...prev,
          fps,
          memory: (performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0,
          loadTime: performance.timing?.loadEventEnd - performance.timing?.navigationStart || 0,
          renderTime: currentTime - lastTime
        }));
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(measureFPS);
    };

    measureFPS();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  const getPerformanceColor = (value: number, thresholds: [number, number]) => {
    if (value >= thresholds[1]) return 'text-green-500';
    if (value >= thresholds[0]) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border p-4"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Activity size={16} />
(Content truncated due to size limit. Use line ranges to read in chunks)
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import ToastProvider from './components/ToastProvider';
import { useKeyboardShortcuts, KEYBOARD_SHORTCUTS } from './hooks/useKeyboardShortcuts';
import MainLayout from "./components/MainLayout";

// Pages
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Friends from "./pages/Friends";
import Groups from "./pages/Groups";
import Messages from "./pages/Messages";
import Marketplace from "./pages/Marketplace";
import Learning from "./pages/Learning";
import Jobs from "./pages/Jobs";
import AIAgents from "./pages/AIAgents";
import Wallet from "./pages/Wallet";
import Trading from "./pages/Trading";
import NFTMarketplace from "./pages/NFTMarketplace";
import IoT from "./pages/IoT";
import Robotics from "./pages/Robotics";
import Governance from "./pages/Governance";

function Router() {
  useKeyboardShortcuts(KEYBOARD_SHORTCUTS);
  
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/profile/:id?" component={Profile} />
        <Route path="/friends" component={Friends} />
        <Route path="/groups" component={Groups} />
        <Route path="/messages" component={Messages} />
        <Route path="/marketplace" component={Marketplace} />
        <Route path="/learning" component={Learning} />
        <Route path="/jobs" component={Jobs} />
        <Route path="/ai-agents" component={AIAgents} />
        <Route path="/wallet" component={Wallet} />
        <Route path="/trading" component={Trading} />
        <Route path="/nft" component={NFTMarketplace} />
        <Route path="/iot" component={IoT} />
        <Route path="/robotics" component={Robotics} />
        <Route path="/governance" component={Governance} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <AuthProvider>
          <ThemeProvider defaultTheme="light">
            <TooltipProvider>
              <Toaster />
              <ToastProvider />
              <Router />
            </TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;


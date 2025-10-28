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
import HealthDashboard from "./pages/HealthDashboard";
import AuditLogs from "./pages/AuditLogs";
import MfaSettings from "./pages/MfaSettings";
import MfaVerification from "./pages/MfaVerification";
import World from "./pages/World";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import BugBounty from "./pages/BugBounty";

// NEW: 7 directories added
import BillingDashboard from "./pages/billing/BillingDashboard";
import DeveloperHub from "./pages/dev-tools/DeveloperHub";
import SellerDashboard from "./pages/ecommerce/SellerDashboard";
import InstructorDashboard from "./pages/elearning/InstructorDashboard";
import FinanceDashboard from "./pages/finance/FinanceDashboard";
import ForumsDashboard from "./pages/forums/ForumsDashboard";
import HelpCenter from "./pages/help/HelpCenter";

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
        <Route path="/health" component={HealthDashboard} />
        <Route path="/audit-logs" component={AuditLogs} />
        <Route path="/settings/mfa" component={MfaSettings} />
        <Route path="/verify-mfa" component={MfaVerification} />
        <Route path="/world" component={World} />
        <Route path="/analytics" component={AnalyticsDashboard} />
        <Route path="/bug-bounty" component={BugBounty} />
        
        {/* NEW: 7 directories routes */}
        <Route path="/billing" component={BillingDashboard} />
        <Route path="/developer" component={DeveloperHub} />
        <Route path="/seller" component={SellerDashboard} />
        <Route path="/instructor" component={InstructorDashboard} />
        <Route path="/finance/dashboard" component={FinanceDashboard} />
        <Route path="/forums" component={ForumsDashboard} />
        <Route path="/help/center" component={HelpCenter} />
        
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


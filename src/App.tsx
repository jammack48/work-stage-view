import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ThresholdProvider } from "@/contexts/ThresholdContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToolbarPositionProvider } from "@/contexts/ToolbarPositionContext";
import { TutorialProvider } from "@/contexts/TutorialContext";
import { AppHeader } from "@/components/AppHeader";
import Hub from "./pages/Hub";
import Index from "./pages/Index";
import JobCard from "./pages/JobCard";
import Customers from "./pages/Customers";
import CustomerCard from "./pages/CustomerCard";
import SettingsPage from "./pages/SettingsPage";
import QuotePage from "./pages/QuotePage";
import ComingSoon from "./pages/ComingSoon";
import BundlesPage from "./pages/BundlesPage";
import SchedulePage from "./pages/SchedulePage";
import EmailTemplatesPage from "./pages/EmailTemplatesPage";
import SmsTemplatesPage from "./pages/SmsTemplatesPage";
import InvoicePage from "./pages/InvoicePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppLayout() {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/hub" element={<Hub />} />
          <Route path="/pipeline" element={<Index />} />
          <Route path="/job/:id" element={<JobCard />} />
          <Route path="/quote/:id" element={<QuotePage />} />
          <Route path="/invoice/:id" element={<InvoicePage />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customer/:id" element={<CustomerCard />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/bundles" element={<BundlesPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/email-templates" element={<EmailTemplatesPage />} />
          <Route path="/sms-templates" element={<SmsTemplatesPage />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TutorialProvider>
      <ToolbarPositionProvider>
      <ThresholdProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <AppLayout />
          </BrowserRouter>
        </TooltipProvider>
      </ThresholdProvider>
      </ToolbarPositionProvider>
      </TutorialProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

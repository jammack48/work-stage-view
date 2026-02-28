import { Toaster } from "@/components/ui/toaster";

import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ThresholdProvider } from "@/contexts/ThresholdContext";
import { NotificationStyleProvider } from "@/contexts/NotificationStyleContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToolbarPositionProvider } from "@/contexts/ToolbarPositionContext";
import { TutorialProvider } from "@/contexts/TutorialContext";
import { AppModeProvider, useAppMode } from "@/contexts/AppModeContext";
import { JobPrefixProvider } from "@/contexts/JobPrefixContext";
import { AppHeader } from "@/components/AppHeader";
import { ModePicker } from "@/components/ModePicker";
import { WorkBottomNav } from "@/components/WorkBottomNav";
import Hub from "./pages/Hub";
import Index from "./pages/Index";
import JobCard from "./pages/JobCard";
import WorkHome from "./pages/WorkHome";
import WorkJobCard from "./components/job/WorkJobCard";
import WorkNewJob from "./pages/WorkNewJob";
import Customers from "./pages/Customers";
import CustomerCard from "./pages/CustomerCard";
import SettingsPage from "./pages/SettingsPage";
import QuotePage from "./pages/QuotePage";
import ComingSoon from "./pages/ComingSoon";
import WorkHub from "./pages/WorkHub";
import WorkTimesheet from "./pages/WorkTimesheet";
import BundlesPage from "./pages/BundlesPage";
import SchedulePage from "./pages/SchedulePage";
import EmailTemplatesPage from "./pages/EmailTemplatesPage";
import SmsTemplatesPage from "./pages/SmsTemplatesPage";
import InvoicePage from "./pages/InvoicePage";
import NotFound from "./pages/NotFound";
const queryClient = new QueryClient();

function AppLayout() {
  const { mode, isWorkMode } = useAppMode();

  if (!mode) return <ModePicker />;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className={isWorkMode ? "pb-16" : ""}>
        <Routes>
          {isWorkMode ? (
            <>
              <Route path="/" element={<WorkHome />} />
              <Route path="/hub" element={<WorkHome />} />
              <Route path="/job/:id" element={<WorkJobCard />} />
              <Route path="/new-job" element={<WorkNewJob />} />
              <Route path="/work-hub" element={<WorkHub />} />
              <Route path="/timesheet" element={<WorkTimesheet />} />
              <Route path="*" element={<WorkHome />} />
            </>
          ) : (
            <>
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
              <Route path="*" element={<NotFound />} />
            </>
          )}
        </Routes>
      </div>
      {isWorkMode && <WorkBottomNav />}
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <JobPrefixProvider>
      <AppModeProvider>
      <TutorialProvider>
      <ToolbarPositionProvider>
      <ThresholdProvider>
      <NotificationStyleProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <ScrollToTop />
            <AppLayout />
          </BrowserRouter>
        </TooltipProvider>
      </NotificationStyleProvider>
      </ThresholdProvider>
      </ToolbarPositionProvider>
      </TutorialProvider>
      </AppModeProvider>
      </JobPrefixProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

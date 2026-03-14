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
import { DemoDataProvider } from "@/contexts/DemoDataContext";
import { useState, useEffect } from "react";
import { JobPrefixProvider } from "@/contexts/JobPrefixContext";
import { BackendProvider } from "@/contexts/BackendContext";
import { BackendLogPanel } from "@/components/BackendLogPanel";
import { AppHeader } from "@/components/AppHeader";
import { ModePicker } from "@/components/ModePicker";
import { WorkBottomNav } from "@/components/WorkBottomNav";
import Hub from "./pages/Hub";
import Index from "./pages/Index";
import JobCard from "./pages/JobCard";
import WorkHome from "./pages/WorkHome";
import TimesheetHome from "./pages/TimesheetHome";
import WorkJobCard from "./components/job/WorkJobCard";
import TimesheetOnlyJobCard from "./components/job/TimesheetOnlyJobCard";
import WorkNewJob from "./pages/WorkNewJob";
import IntroJobFlow from "./pages/IntroJobFlow";
import Customers from "./pages/Customers";
import CustomerCard from "./pages/CustomerCard";
import SettingsPage from "./pages/SettingsPage";
import QuotePage from "./pages/QuotePage";
import ComingSoon from "./pages/ComingSoon";
import WorkHub from "./pages/WorkHub";
import WorkTimesheet from "./pages/WorkTimesheet";
import IntroInvoices from "./pages/IntroInvoices";
import WorkNotes from "./pages/WorkNotes";
import WorkChat from "./pages/WorkChat";
import BundlesPage from "./pages/BundlesPage";
import SchedulePage from "./pages/SchedulePage";
import EmailTemplatesPage from "./pages/EmailTemplatesPage";
import SmsTemplatesPage from "./pages/SmsTemplatesPage";
import InvoicePage from "./pages/InvoicePage";

import NotFound from "./pages/NotFound";
import SplashPage from "./pages/SplashPage";
import { OnboardingCarousel } from "./components/OnboardingCarousel";

const queryClient = new QueryClient();

function AppLayout() {
  const { mode, isWorkMode, isTimesheetOnlyMode, isIntroMode, clearMode } = useAppMode();
  const [splashDismissed, setSplashDismissed] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(() => {
    return localStorage.getItem("onboardingSeen") === "true";
  });

  // Each fresh browser session starts at splash → mode picker (clears cached mode)
  useEffect(() => {
    const started = sessionStorage.getItem("appSessionStarted");
    if (!started) {
      sessionStorage.setItem("appSessionStarted", "true");
      clearMode();
    }
  }, [clearMode]);

  if (!splashDismissed) {
    return <SplashPage onStart={() => setSplashDismissed(true)} />;
  }

  if (!onboardingCompleted) {
    return (
      <OnboardingCarousel 
        onComplete={() => {
          localStorage.setItem("onboardingSeen", "true");
          setOnboardingCompleted(true);
        }} 
      />
    );
  }

  if (!mode) {
    return <ModePicker />;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className={isWorkMode ? "pb-16" : ""}>
        <Routes>
          {isWorkMode ? (
            isTimesheetOnlyMode ? (
              <>
                <Route path="/" element={<TimesheetHome />} />
                <Route path="/hub" element={<TimesheetHome />} />
                <Route path="/job/:id" element={<TimesheetOnlyJobCard />} />
                <Route path="/timesheet" element={<WorkTimesheet />} />
                <Route path="/schedule" element={<TimesheetHome />} />
                <Route path="*" element={<TimesheetHome />} />
              </>
            ) : isIntroMode ? (
              <>
                <Route path="/" element={<IntroJobFlow />} />
                <Route path="/intro-invoices" element={<IntroInvoices />} />
                <Route path="*" element={<IntroJobFlow />} />
              </>
            ) : (
              <>
                <Route path="/" element={<WorkHome />} />
                <Route path="/hub" element={<WorkHome />} />
                <Route path="/job/:id" element={<WorkJobCard />} />
                <Route path="/new-job" element={<WorkNewJob />} />
                <Route path="/work-notes" element={<WorkNotes />} />
                <Route path="/work-chat" element={<WorkChat />} />
                <Route path="/work-hub" element={<WorkHub />} />
                <Route path="/timesheet" element={<WorkTimesheet />} />
                <Route path="/schedule" element={<SchedulePage />} />
                <Route path="*" element={<WorkHome />} />
              </>
            )
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
      <BackendProvider>
      <JobPrefixProvider>
      <AppModeProvider>
      <DemoDataProvider>
      <TutorialProvider>
      <ToolbarPositionProvider>
      <ThresholdProvider>
      <NotificationStyleProvider>
        <TooltipProvider>
          <Toaster />
          <BackendLogPanel />
          <BrowserRouter>
            <ScrollToTop />
            <AppLayout />
          </BrowserRouter>
        </TooltipProvider>
      </NotificationStyleProvider>
      </ThresholdProvider>
      </ToolbarPositionProvider>
      </TutorialProvider>
      </DemoDataProvider>
      </AppModeProvider>
      </JobPrefixProvider>
      </BackendProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

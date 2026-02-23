import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThresholdProvider } from "@/contexts/ThresholdContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToolbarPositionProvider } from "@/contexts/ToolbarPositionContext";
import Index from "./pages/Index";
import JobCard from "./pages/JobCard";
import Customers from "./pages/Customers";
import CustomerCard from "./pages/CustomerCard";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import QuotePage from "./pages/QuotePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <ToolbarPositionProvider>
      <ThresholdProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/job/:id" element={<JobCard />} />
              <Route path="/quote/:id" element={<QuotePage />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/customer/:id" element={<CustomerCard />} />
              <Route path="/settings" element={<SettingsPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThresholdProvider>
      </ToolbarPositionProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ExperienceProvider } from "@/contexts/ExperienceContext";
import ExperienceLayout from "@/components/spatial/ExperienceLayout";
import "./spatial.css";
import Navigation from "./components/ui/nav";
import CalculatorPage from "./pages/Calculator";
import ComparisonsPage from "./pages/Comparisons";
import HistoryPage from "./pages/History";
import BatchCalculatorPage from "./pages/BatchCalculator";
import PipelinePage from "./pages/Pipeline";
import WizardPage from "./pages/Wizard";
import TeamSimulatorPage from "./pages/TeamSimulator";
import DashboardPage from "./pages/Dashboard";
import PriceTrackerPage from "./pages/PriceTracker";
import TokensGuidePage from "./pages/TokensGuide";
import CommandPalette from "./components/CommandPalette";
import { CorporateHero, CorporateFooter } from "./components/CorporateFrame";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <ThemeProvider>
        <ExperienceProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <Navigation />
              <CorporateHero />
              <CommandPalette />
              <ExperienceLayout>
              <Routes>
                <Route path="/" element={<CalculatorPage />} />
                <Route path="/comparisons" element={<ComparisonsPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/batch" element={<BatchCalculatorPage />} />
                <Route path="/pipeline" element={<PipelinePage />} />
                <Route path="/wizard" element={<WizardPage />} />
                <Route path="/team" element={<TeamSimulatorPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/prices" element={<PriceTrackerPage />} />
                <Route path="/tokens" element={<TokensGuidePage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              </ExperienceLayout>
              <CorporateFooter />
            </div>
          </BrowserRouter>
        </TooltipProvider>
        </ExperienceProvider>
      </ThemeProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;

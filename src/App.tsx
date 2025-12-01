import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Agreement from "./pages/Agreement";
import ReservationForm from "./pages/ReservationForm";
import ReservationComplete from "./pages/ReservationComplete";
import Index from "./pages/Index";
import ProgressView from "./pages/ProgressView";
import AdminApproval from "./pages/AdminApproval";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Notice from "./pages/Notice";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reservation/agreement" element={<Agreement />} />
          <Route path="/reservation/form" element={<ReservationForm />} />
          <Route path="/reservation/complete" element={<ReservationComplete />} />
          <Route path="/progress" element={<ProgressView />} />
          <Route path="/progress/view" element={<ProgressView />} />
          <Route path="/employee" element={<EmployeeDashboard />} />
          <Route path="/admin/approval" element={<AdminApproval />} />
          <Route path="/notice" element={<Notice />} />
          <Route path="/faq" element={<FAQ />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

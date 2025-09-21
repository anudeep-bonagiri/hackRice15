import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import DemoLogin from "./pages/DemoLogin";
import Dashboard from "./pages/Dashboard";
import Modules from "./pages/Modules";
import Module from "./pages/Module";
import CreditReport from "./pages/CreditReport";
import FaceVerification from "./pages/FaceVerification";
import MiniGame from "./pages/MiniGame";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/demo" element={<DemoLogin />} />
          <Route path="/face-verify" element={<FaceVerification />} />
          <Route path="/dashboard" element={
            <ProtectedRoute requireVerification={true}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/modules" element={
            <ProtectedRoute requireVerification={true}>
              <Modules />
            </ProtectedRoute>
          } />
          <Route path="/module/:id" element={
            <ProtectedRoute requireVerification={true}>
              <Module />
            </ProtectedRoute>
          } />
          <Route path="/credit-report" element={
            <ProtectedRoute requireVerification={true}>
              <CreditReport />
            </ProtectedRoute>
          } />
          <Route path="/mini-game" element={
            <ProtectedRoute requireVerification={true}>
              <MiniGame />
            </ProtectedRoute>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

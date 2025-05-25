// App.tsx
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthGuard from '@/components/routing/AuthGuard';
import ProtectedRoute from '@/components/routing/ProtectedRoute';

import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import CRM from "./pages/CRM";
import Contacts from "./pages/Contacts";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import VerifyEmail from "./pages/VerifyEmail";
import MeetingPage from "./pages/Meeting";
import Plans from "./pages/Plans";
import SignOut from "./pages/SignOut";
import ResetPassword from "./pages/ResetPassword";
import MeetingDetails from "./pages/MeetingDetails";
import PlanChangeSuccess from "./pages/PlanChangeSuccess";
import MeetingsPage from "./pages/Meetings";
import AdvisorLM from "./pages/AdvisorLM";
import { supabase } from "./lib/supabaseClient";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const syncToken = async () => {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (token) {
        localStorage.setItem("access_token", token);
      }
    };

    syncToken();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const token = session?.access_token;
      if (token) {
        localStorage.setItem("access_token", token);
      } else {
        localStorage.removeItem("access_token");
      }
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/meeting-details" element={<MeetingDetails />} />
            
            <Route
              path="/crm/contacts"
              element={
                <ProtectedRoute allowedPlans={['basic','lite', 'pro']}>
                  <AuthGuard>
                    <Contacts />
                  </AuthGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/crm/calendar"
              element={
                <ProtectedRoute allowedPlans={['basic','lite', 'pro']}>
                  <AuthGuard>
                    <Calendar />
                  </AuthGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/crm/settings"
              element={
                <ProtectedRoute allowedPlans={['basic','lite', 'pro']}>
                  <AuthGuard>
                    <Settings />
                  </AuthGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/meeting"
              element={
                <ProtectedRoute allowedPlans={['lite', 'pro']}>
                  <AuthGuard>
                    <MeetingPage />
                  </AuthGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/plans"
              element={
                <AuthGuard>
                  <Plans />
                </AuthGuard>
              }
            />
            <Route
              path="/plans/success"
              element={
                <AuthGuard>
                  <PlanChangeSuccess />
                </AuthGuard>
              }
            />
            <Route
              path="/crm"
              element={
                <ProtectedRoute allowedPlans={['basic','lite', 'pro']}>
                  <AuthGuard>
                    <CRM />
                  </AuthGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/crm/meetings"
              element={
                <ProtectedRoute allowedPlans={['lite', 'pro']}>
                  <AuthGuard>
                    <MeetingsPage />
                  </AuthGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/crm/advisorlm"
              element={
                <ProtectedRoute allowedPlans={['pro']}>
                  <AuthGuard>
                    <AdvisorLM />
                  </AuthGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/signout"
              element={
                <AuthGuard>
                  <SignOut />
                </AuthGuard>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

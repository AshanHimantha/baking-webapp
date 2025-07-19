// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import ProtectedRoute from "@/components/ProtectedRoute";
import KYCOnlyRoute from "@/components/KYCOnlyRoute";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import KYC from "./pages/KYC";
import AdminSignIn from "./pages/admin/SignIn";
import CustomerDashboard from "./pages/customer/Dashboard";
import CustomerTransactions from "./pages/customer/Transactions";
import CustomerTransfer from "./pages/customer/Transfer";
import CustomerCards from "./pages/customer/Cards";
import CustomerProfile from "./pages/customer/Profile";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCustomers from "./pages/admin/Customers";
import AdminTransactions from "./pages/admin/Transactions";
import AdminApprovals from "./pages/admin/Approvals";

import AdminProfile from "./pages/admin/Profile";
import UserAudit from "./pages/admin/UserAudit";
import NotFound from "./pages/NotFound";

import { useEffect } from "react"; // <--- IMPORT useEffect
import { useUserStore } from "@/store/userStore"; // <--- IMPORT YOUR STORE

const queryClient = new QueryClient();

const App = () => { // <--- Make sure App is a functional component
  const fetchUserProfile = useUserStore((state) => state.fetchUserProfile);

  useEffect(() => {

    fetchUserProfile();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'auth_token') {
        fetchUserProfile();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [fetchUserProfile]); // Dependency array: ensures it runs on mount

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="banking-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route
                path="/kyc"
                element={
                  <KYCOnlyRoute>
                    <KYC />
                  </KYCOnlyRoute>
                }
              />
              <Route path="/admin/signin" element={<AdminSignIn />} />
              
              {/* Customer Banking Routes */}
              <Route path="/customer/dashboard" element={
                <ProtectedRoute requiredRole={["ADMIN", "EMPLOYEE", "CUSTOMER"]}>
                  <CustomerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/customer/transactions" element={
                <ProtectedRoute requiredRole={["ADMIN", "EMPLOYEE", "CUSTOMER"]}>
                  <CustomerTransactions />
                </ProtectedRoute>
              } />
              <Route path="/customer/transfer" element={
                <ProtectedRoute requiredRole={["ADMIN", "EMPLOYEE", "CUSTOMER"]}>
                  <CustomerTransfer />
                </ProtectedRoute>
              } />
              <Route path="/customer/cards" element={
                <ProtectedRoute requiredRole={["ADMIN", "EMPLOYEE", "CUSTOMER"]}>
                  <CustomerCards />
                </ProtectedRoute>
              } />
              <Route path="/customer/profile" element={
                <ProtectedRoute  requiredRole={["ADMIN", "EMPLOYEE", "CUSTOMER"]}>
                  <CustomerProfile />
                </ProtectedRoute>
              } />
              
              {/* Admin Dashboard Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute requiredRole={"ADMIN"}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/customers" element={
                <ProtectedRoute requiredRole={["ADMIN", "EMPLOYEE"]}>
                  <ErrorBoundary>
                    <AdminCustomers />
                  </ErrorBoundary>
                </ProtectedRoute>
              } />
              <Route path="/admin/transactions" element={
                <ProtectedRoute requiredRole={["ADMIN", "EMPLOYEE"]}>
                  <AdminTransactions />
                </ProtectedRoute>
              } />
              <Route path="/admin/user-audit/:username" element={
                <ProtectedRoute requiredRole={["ADMIN", "EMPLOYEE"]}>
                  <UserAudit />
                </ProtectedRoute>
              } />
              <Route path="/admin/approvals" element={
                <ProtectedRoute requiredRole={["ADMIN", "EMPLOYEE"]}>
                  <AdminApprovals />
                </ProtectedRoute>
              } />
           
              <Route path="/admin/profile" element={
                <ProtectedRoute requiredRole={["ADMIN", "EMPLOYEE"]}>
                  <AdminProfile />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
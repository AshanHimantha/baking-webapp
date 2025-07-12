
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
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
import AdminReports from "./pages/admin/Reports";
import AdminProfile from "./pages/admin/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
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
            <Route path="/kyc" element={<KYC />} />
            <Route path="/admin/signin" element={<AdminSignIn />} />
            
            {/* Customer Banking Routes */}
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/transactions" element={<CustomerTransactions />} />
            <Route path="/customer/transfer" element={<CustomerTransfer />} />
            <Route path="/customer/cards" element={<CustomerCards />} />
            <Route path="/customer/profile" element={<CustomerProfile />} />
            
            {/* Admin Dashboard Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/customers" element={<AdminCustomers />} />
            <Route path="/admin/transactions" element={<AdminTransactions />} />
            <Route path="/admin/approvals" element={<AdminApprovals />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

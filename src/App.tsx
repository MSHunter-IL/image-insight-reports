
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Dashboard } from "./components/Dashboard";
import { ReportProvider } from "./context/ReportContext";
import { LogoProvider } from "./context/LogoContext";
import { CompanyProvider } from "./context/CompanyContext";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from "./pages/Auth";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCanceled from "./pages/PaymentCanceled";
import Subscription from "./pages/Subscription";
import { useAuth } from "./context/AuthContext";

// רכיב דרך מוגנת
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">טוען...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// נתב האפליקציה
const AppRouter = () => {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/subscription" 
          element={
            <ProtectedRoute>
              <Subscription />
            </ProtectedRoute>
          } 
        />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-canceled" element={<PaymentCanceled />} />
      </Routes>
      <Toaster />
    </Router>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ReportProvider>
          <LogoProvider>
            <CompanyProvider>
              <AppRouter />
            </CompanyProvider>
          </LogoProvider>
        </ReportProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;

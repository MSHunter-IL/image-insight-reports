
import { Toaster } from "@/components/ui/toaster";
import { Dashboard } from "./components/Dashboard";
import { ReportProvider } from "./context/ReportContext";
import { LogoProvider } from "./context/LogoContext";
import { CompanyProvider } from "./context/CompanyContext";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from "./pages/Auth";
import { useAuth } from "./context/AuthContext";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// App router
const AppRouter = () => {
  return (
    <Router>
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

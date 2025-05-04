
import { Toaster } from "@/components/ui/toaster";
import { Dashboard } from "./components/Dashboard";
import { ReportProvider } from "./context/ReportContext";
import { LogoProvider } from "./context/LogoContext";
import { CompanyProvider } from "./context/CompanyContext";
import { LanguageProvider } from "./context/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <ReportProvider>
        <LogoProvider>
          <CompanyProvider>
            <Dashboard />
            <Toaster />
          </CompanyProvider>
        </LogoProvider>
      </ReportProvider>
    </LanguageProvider>
  );
}

export default App;

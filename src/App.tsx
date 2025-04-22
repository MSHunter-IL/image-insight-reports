
import { Toaster } from "@/components/ui/toaster";
import { Dashboard } from "./components/Dashboard";
import { ReportProvider } from "./context/ReportContext";
import { LogoProvider } from "./context/LogoContext";
import { CompanyProvider } from "./context/CompanyContext";

function App() {
  return (
    <ReportProvider>
      <LogoProvider>
        <CompanyProvider>
          <Dashboard />
          <Toaster />
        </CompanyProvider>
      </LogoProvider>
    </ReportProvider>
  );
}

export default App;

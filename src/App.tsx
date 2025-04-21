
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import { Toaster } from './components/ui/toaster';
import { ReportProvider } from './context/ReportContext';
import { SiteProvider } from './context/SiteContext';
import Sites from './pages/Sites';
import SiteView from './pages/SiteView';

import './App.css';

function App() {
  return (
    <ReportProvider>
      <SiteProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sites" element={<Sites />} />
            <Route path="/sites/:siteId" element={<SiteView />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </SiteProvider>
    </ReportProvider>
  );
}

export default App;

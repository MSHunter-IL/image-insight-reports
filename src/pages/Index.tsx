
import React from 'react';
import { Dashboard } from '@/components/Dashboard';
import { ReportProvider } from '@/context/ReportContext';

const Index = () => {
  return (
    <ReportProvider>
      <Dashboard />
    </ReportProvider>
  );
};

export default Index;

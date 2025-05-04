
import React, { useState } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { useReport } from '@/context/ReportContext';
import { useLogo } from '@/context/LogoContext';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Building, List } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { generateReportContent } from '@/utils/reportGenerator';
import { CompanyInfoTab } from './dashboard/CompanyInfoTab';
import { CompanyReportsTab } from './dashboard/CompanyReportsTab';
import { NoDashboardContent } from './dashboard/NoDashboardContent';

export function CompanyDashboard() {
  const { selectedCompany } = useCompany();
  const { entries } = useReport();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { customLogo } = useLogo();
  const [selectedTab, setSelectedTab] = useState<'info' | 'reports'>('info');

  // Early return if no company is selected
  if (!selectedCompany) {
    return <NoDashboardContent />;
  }
  
  // Filter entries for this company
  const companyEntries = entries.filter(entry => 
    !entry.companyId || entry.companyId === selectedCompany.id
  );

  const handleGenerateReport = () => {
    if (companyEntries.length === 0) {
      toast({
        title: t('no.data'),
        description: t('no.survey.items'),
        variant: "destructive"
      });
      return;
    }
    
    const htmlContent = generateReportContent(companyEntries, selectedCompany, true, customLogo);
    
    const reportWindow = window.open('', '_blank');
    if (reportWindow) {
      reportWindow.document.write(htmlContent);
      reportWindow.document.close();
      reportWindow.focus();

      toast({
        title: t('survey.generated'),
        description: t('survey.opened'),
      });
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5" />
              {selectedCompany.name}
            </CardTitle>
            <CardDescription>
              {t('company.dashboard')}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={selectedTab === 'info' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSelectedTab('info')}
            >
              <Building className="mr-1 h-4 w-4" />
              {t('company.details')}
            </Button>
            <Button 
              variant={selectedTab === 'reports' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSelectedTab('reports')}
            >
              <List className="mr-1 h-4 w-4" />
              {t('report.items')}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {selectedTab === 'info' && (
          <CompanyInfoTab 
            selectedCompany={selectedCompany}
            companyEntries={companyEntries}
          />
        )}
        
        {selectedTab === 'reports' && (
          <CompanyReportsTab companyEntries={companyEntries} />
        )}
      </CardContent>
      
      <CardFooter className="justify-end">
        <Button 
          variant="outline" 
          className="ml-2"
          onClick={handleGenerateReport}
          disabled={companyEntries.length === 0}
        >
          <FileText className="mr-2 h-4 w-4" />
          {t('export.for.company')}
        </Button>
      </CardFooter>
    </Card>
  );
}

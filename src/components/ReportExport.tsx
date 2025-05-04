
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useReport } from '@/context/ReportContext';
import { useToast } from '@/components/ui/use-toast';
import { generateReportContent } from '@/utils/reportGenerator';
import { History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClearAllConfirmation } from './report/ClearAllConfirmation';
import { LogoUploader } from './report/LogoUploader';
import { ReportActions } from './report/ReportActions';
import { ReportExportProps } from './report/types';
import { CompanySelector } from './company/CompanySelector';
import { CompanyDashboard } from './company/CompanyDashboard';
import { useCompany } from '@/context/CompanyContext';
import { useLogo } from '@/context/LogoContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ReportExport({ companyDetails }: ReportExportProps) {
  const { entries, clearAllEntries } = useReport();
  const { selectedCompany } = useCompany();
  const { customLogo } = useLogo();
  const { toast } = useToast();

  const generateReport = (includeSummary = false) => {
    if (entries.length === 0) {
      toast({
        title: "אין נתונים",
        description: "אין פריטים בסקר להצגה",
        variant: "destructive"
      });
      return;
    }

    // Use selected company details if available, otherwise use the provided companyDetails
    const reportCompanyDetails = selectedCompany || companyDetails;
    
    const htmlContent = generateReportContent(entries, reportCompanyDetails, includeSummary, customLogo);
    
    const reportWindow = window.open('', '_blank');
    if (reportWindow) {
      reportWindow.document.write(htmlContent);
      reportWindow.document.close();
      reportWindow.focus();

      toast({
        title: "סקר הופק בהצלחה",
        description: "הסקר נפתח בחלון חדש",
      });
    }
  };

  return (
    <>
      <CompanySelector />
      
      <CompanyDashboard />
      
      <Card>
        <CardHeader>
          <CardTitle>הפקת דוח</CardTitle>
        </CardHeader>
        <CardContent>
          <LogoUploader />
          
          <div className="mt-6">
            <ReportActions
              onGenerateReport={generateReport}
              disabled={entries.length === 0}
              companyDetails={selectedCompany || companyDetails}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <ClearAllConfirmation 
            onClear={clearAllEntries}
            disabled={entries.length === 0}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => toast({
                    title: "היסטוריה",
                    description: "הגרסה הנוכחית: 1.0",
                  })}
                >
                  <History className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>הצג היסטוריית גרסאות</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardFooter>
      </Card>
    </>
  );
}

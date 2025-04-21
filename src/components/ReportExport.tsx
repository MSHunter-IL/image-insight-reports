
import React from 'react';
import { Button } from '@/components/ui/button';
import { useReport } from '@/context/ReportContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileDown, ClipboardList, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { generateReportContent } from '@/utils/reportGenerator';
import { ClearAllConfirmation } from './report/ClearAllConfirmation';

interface CompanyDetails {
  name: string;
  address: string;
  contactName: string;
  contactPhone: string;
}

interface ReportExportProps {
  companyDetails: CompanyDetails;
}

export function ReportExport({ companyDetails }: ReportExportProps) {
  const { entries, clearAllEntries } = useReport();
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

    const htmlContent = generateReportContent(entries, companyDetails, includeSummary);
    
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

  const generateReportWithSummary = () => {
    generateReport(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>כלי סקר</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Button 
            onClick={() => generateReport()} 
            className="w-full"
            disabled={entries.length === 0}
          >
            <FileText className="ml-2 h-4 w-4" />
            הפק סקר
          </Button>
          
          <Button 
            onClick={generateReportWithSummary} 
            className="w-full"
            disabled={entries.length === 0}
            variant="secondary"
          >
            <ClipboardList className="ml-2 h-4 w-4" />
            הפק סקר עם ניתוח וסיכום
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <ClearAllConfirmation 
          onClear={clearAllEntries}
          disabled={entries.length === 0}
        />
      </CardFooter>
    </Card>
  );
}

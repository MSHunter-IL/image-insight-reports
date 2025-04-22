
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useReport } from '@/context/ReportContext';
import { useToast } from '@/components/ui/use-toast';
import { generateReportContent } from '@/utils/reportGenerator';
import { History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClearAllConfirmation } from './report/ClearAllConfirmation';
import { LogoUploader } from './report/LogoUploader';
import { SurveyTools } from './report/SurveyTools';
import { ReportActions } from './report/ReportActions';
import { SurveyTool, ReportExportProps } from './report/types';
import { CompanySelector } from './company/CompanySelector';
import { CompanyDashboard } from './company/CompanyDashboard';
import { useCompany } from '@/context/CompanyContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ReportExport({ companyDetails }: ReportExportProps) {
  const { entries, clearAllEntries } = useReport();
  const { selectedCompany } = useCompany();
  const { toast } = useToast();
  const [surveyTools, setSurveyTools] = useState<SurveyTool[]>([
    {
      id: '1',
      name: 'סקר בטיחות סטנדרטי',
      type: 'standard',
      downloadCount: 0
    }
  ]);

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
    
    const htmlContent = generateReportContent(entries, reportCompanyDetails, includeSummary);
    
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

  const downloadTool = (toolId: string) => {
    setSurveyTools(prevTools => 
      prevTools.map(tool => 
        tool.id === toolId 
          ? { ...tool, downloadCount: tool.downloadCount + 1, lastDownload: new Date() } 
          : tool
      )
    );
    
    toast({
      title: "כלי סקר הורד",
      description: "כלי הסקר הורד בהצלחה",
    });
  };

  const addNewTool = (name: string, type: string) => {
    const newTool: SurveyTool = {
      id: Date.now().toString(),
      name,
      type,
      downloadCount: 0
    };
    
    setSurveyTools(prev => [...prev, newTool]);
    
    toast({
      title: "כלי סקר נוסף",
      description: "כלי הסקר נוסף בהצלחה",
    });
  };

  return (
    <>
      <CompanySelector />
      
      <CompanyDashboard />
      
      <Card>
        <CardHeader>
          <CardTitle>כלי סקר</CardTitle>
        </CardHeader>
        <CardContent>
          <LogoUploader />
          
          <Accordion type="single" collapsible className="mb-4 mt-4">
            <AccordionItem value="tools">
              <AccordionTrigger>כלי סקר זמינים</AccordionTrigger>
              <AccordionContent>
                <SurveyTools 
                  tools={surveyTools}
                  onDownload={downloadTool}
                  onAddTool={addNewTool}
                />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="history">
              <AccordionTrigger>היסטוריית הורדות</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {surveyTools.filter(tool => tool.lastDownload).map(tool => (
                    <div key={tool.id} className="border-b pb-2">
                      <p className="font-medium">{tool.name}</p>
                      <p className="text-xs text-muted-foreground">
                        הורד בתאריך: {tool.lastDownload?.toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  {!surveyTools.some(tool => tool.lastDownload) && (
                    <p className="text-muted-foreground">אין היסטוריית הורדות</p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <ReportActions
            onGenerateReport={generateReport}
            disabled={entries.length === 0}
          />
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

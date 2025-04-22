
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useReport } from '@/context/ReportContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileDown, ClipboardList, FileText, File, History, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { generateReportContent } from '@/utils/reportGenerator';
import { ClearAllConfirmation } from './report/ClearAllConfirmation';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { CompanyDetails, SurveyTool } from '@/types/report';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogoUploader } from './report/LogoUploader';

interface ReportExportProps {
  companyDetails: CompanyDetails;
}

export function ReportExport({ companyDetails }: ReportExportProps) {
  const { entries, clearAllEntries } = useReport();
  const { toast } = useToast();
  const [surveyTools, setSurveyTools] = useState<SurveyTool[]>([
    {
      id: '1',
      name: 'סקר בטיחות סטנדרטי',
      type: 'standard',
      downloadCount: 0
    }
  ]);
  const [newToolName, setNewToolName] = useState('');
  const [newToolType, setNewToolType] = useState('');
  const [toolDialogOpen, setToolDialogOpen] = useState(false);

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

  const downloadTool = (toolId: string) => {
    // Update download count
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

  const addNewTool = () => {
    if (!newToolName) {
      toast({
        title: "שגיאה",
        description: "יש להזין שם לכלי הסקר",
        variant: "destructive"
      });
      return;
    }
    
    const newTool: SurveyTool = {
      id: Date.now().toString(),
      name: newToolName,
      type: newToolType || 'custom',
      downloadCount: 0
    };
    
    setSurveyTools(prev => [...prev, newTool]);
    setNewToolName('');
    setNewToolType('');
    setToolDialogOpen(false);
    
    toast({
      title: "כלי סקר נוסף",
      description: "כלי הסקר נוסף בהצלחה",
    });
  };

  return (
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
              <div className="space-y-2">
                {surveyTools.map(tool => (
                  <div key={tool.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{tool.name}</p>
                      <p className="text-xs text-muted-foreground">
                        הורד {tool.downloadCount} פעמים
                        {tool.lastDownload && ` • עודכן לאחרונה: ${tool.lastDownload.toLocaleDateString()}`}
                      </p>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => downloadTool(tool.id)}
                          >
                            <FileDown className="h-4 w-4 mr-1" />
                            הורד
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>הורד כלי סקר</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ))}
                
                <Dialog open={toolDialogOpen} onOpenChange={setToolDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full mt-2">
                      <Plus className="mr-1 h-4 w-4" />
                      הוסף כלי סקר חדש
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>הוספת כלי סקר חדש</DialogTitle>
                      <DialogDescription>
                        הזן את פרטי כלי הסקר החדש
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <Label htmlFor="toolName">שם כלי הסקר</Label>
                        <Input 
                          id="toolName" 
                          value={newToolName} 
                          onChange={(e) => setNewToolName(e.target.value)} 
                          placeholder="לדוגמה: סקר בטיחות אש"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="toolType">סוג הסקר</Label>
                        <Input 
                          id="toolType" 
                          value={newToolType} 
                          onChange={(e) => setNewToolType(e.target.value)} 
                          placeholder="לדוגמה: בטיחות אש, בטיחות בעבודה"
                        />
                      </div>
                      <Button onClick={addNewTool} className="w-full">
                        הוסף כלי סקר
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
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

        <div className="space-y-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={() => generateReport()} 
                  className="w-full"
                  disabled={entries.length === 0}
                >
                  <FileText className="ml-2 h-4 w-4" />
                  הפק סקר
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>הצג את הסקר בחלון חדש</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={generateReportWithSummary} 
                  className="w-full"
                  disabled={entries.length === 0}
                  variant="secondary"
                >
                  <ClipboardList className="ml-2 h-4 w-4" />
                  הפק סקר עם ניתוח וסיכום
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>הצג את הסקר עם ניתוח וסיכום בחלון חדש</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={() => generateReport(true)} 
                  className="w-full"
                  disabled={entries.length === 0}
                  variant="outline"
                >
                  <File className="ml-2 h-4 w-4" />
                  הורד כ-PDF
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>הורד את הסקר כקובץ PDF</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
  );
}

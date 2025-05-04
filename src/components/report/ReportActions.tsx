
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, ClipboardList, File, Mail, Check } from 'lucide-react';
import { ReportActionsProps } from './types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from '@/components/ui/use-toast';
import { generatePdfReport, emailReport } from '@/utils/reportGenerator';
import { useReport } from '@/context/ReportContext';
import { CompanyDetails } from '@/types/report';

export function ReportActions({ onGenerateReport, disabled, companyDetails }: ReportActionsProps) {
  const { toast } = useToast();
  const { entries, markAllAsTreated } = useReport();
  
  const handlePdfDownload = async () => {
    try {
      generatePdfReport(entries, companyDetails, true);
      toast({
        title: "הורדת PDF",
        description: "קובץ ה-PDF מתחיל להיווצר ויורד בקרוב",
      });
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בהורדת קובץ ה-PDF",
        variant: "destructive"
      });
    }
  };
  
  const handleSendEmail = async () => {
    if (!companyDetails.contactEmail) {
      toast({
        title: "שגיאה",
        description: "לא הוזנה כתובת אימייל לשליחה",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const result = await emailReport(entries, companyDetails);
      toast({
        title: "הדוח נשלח בהצלחה",
        description: `הדוח נשלח אל ${companyDetails.contactEmail}`,
      });
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בשליחת האימייל",
        variant: "destructive"
      });
    }
  };
  
  const handleMarkAllAsTreated = () => {
    markAllAsTreated();
    toast({
      title: "כל הפריטים סומנו כטופלו",
      description: "סטטוס כל הפריטים עודכן ל'טופל'",
    });
  };

  return (
    <div className="space-y-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={() => onGenerateReport()} 
              className="w-full"
              disabled={disabled}
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
              onClick={() => onGenerateReport(true)} 
              className="w-full"
              disabled={disabled}
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
              onClick={handlePdfDownload} 
              className="w-full"
              disabled={disabled}
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
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={handleSendEmail} 
              className="w-full"
              disabled={disabled || !companyDetails.contactEmail}
              variant="default"
            >
              <Mail className="ml-2 h-4 w-4" />
              שלח במייל
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{companyDetails.contactEmail ? `שלח לכתובת: ${companyDetails.contactEmail}` : "לא הוגדרה כתובת מייל"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={handleMarkAllAsTreated} 
              className="w-full"
              disabled={disabled}
              variant="outline"
            >
              <Check className="ml-2 h-4 w-4" />
              סמן הכל כטופל
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>סמן את כל פריטי הדוח כטופלו</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

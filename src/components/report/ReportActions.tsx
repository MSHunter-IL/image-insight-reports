
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, ClipboardList, File } from 'lucide-react';
import { ReportActionsProps } from './types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ReportActions({ onGenerateReport, disabled }: ReportActionsProps) {
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
              onClick={() => onGenerateReport(true)} 
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
    </div>
  );
}

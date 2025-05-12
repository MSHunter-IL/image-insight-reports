
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, Mail, CheckSquare } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useReport } from '@/context/ReportContext';
import { emailReport } from '@/utils/reportGenerator';
import { CompanyDetails } from '@/types/report';
import { ReportActionsProps } from './types';
import { useLanguage } from '@/context/LanguageContext';

export function ReportActions({ 
  onGenerateReport, 
  disabled,
  companyDetails 
}: ReportActionsProps) {
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { toast } = useToast();
  const { markAllAsTreated } = useReport();
  const { t } = useLanguage();

  const handleEmailSend = async () => {
    if (!companyDetails.contactEmail) {
      toast({
        title: "שגיאה",
        description: "לא סופקה כתובת אימייל לחברה זו",
        variant: "destructive"
      });
      return;
    }

    setIsSendingEmail(true);
    
    try {
      const result = await emailReport([], companyDetails, false);
      
      toast({
        title: "אימייל נשלח",
        description: result.message,
      });
    } catch (error: any) {
      toast({
        title: "שגיאה",
        description: error.message || "שליחת האימייל נכשלה",
        variant: "destructive"
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleMarkAllAsTreated = () => {
    markAllAsTreated();
    toast({
      title: t('success'),
      description: t('all.items.marked'),
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          className="w-full sm:w-auto" 
          onClick={() => onGenerateReport(false)} 
          disabled={disabled}
        >
          <FileText className="h-4 w-4 mr-2" />
          {t('generate.report')}
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full sm:w-auto" 
          onClick={() => onGenerateReport(true)} 
          disabled={disabled}
        >
          <FileText className="h-4 w-4 mr-2" />
          {t('generate.with.summary')}
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          className="w-full sm:w-auto" 
          onClick={handleEmailSend} 
          disabled={disabled || isSendingEmail || !companyDetails.contactEmail}
        >
          {isSendingEmail ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t('sending')}...
            </>
          ) : (
            <>
              <Mail className="h-4 w-4 mr-2" />
              {t('send.email')}
            </>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full sm:w-auto" 
          onClick={handleMarkAllAsTreated}
          disabled={disabled}
        >
          <CheckSquare className="h-4 w-4 mr-2" />
          {t('mark.all.as.treated')}
        </Button>
      </div>
    </div>
  );
}


import React from 'react';
import { 
  Building, MapPin, User, Phone, Mail, Calendar, List
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

interface CompanyFormProps {
  companyName: string;
  setCompanyName: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  contactName: string;
  setContactName: (value: string) => void;
  contactPhone: string;
  setContactPhone: (value: string) => void;
  contactEmail: string;
  setContactEmail: (value: string) => void;
  surveyDate: Date | undefined;
  setSurveyDate: (date: Date | undefined) => void;
  surveyStatus: string;
  setSurveyStatus: (value: string) => void;
}

export function CompanyForm({
  companyName,
  setCompanyName,
  address,
  setAddress,
  contactName,
  setContactName,
  contactPhone,
  setContactPhone,
  contactEmail,
  setContactEmail,
  surveyDate,
  setSurveyDate,
  surveyStatus,
  setSurveyStatus
}: CompanyFormProps) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Label className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                {t('company.name')}
              </Label>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('company.name.tip')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Input 
          placeholder={t('company.name')} 
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className={cn(
            companyName ? "border-green-500 focus-visible:ring-green-500" : "",
            "transition-colors"
          )}
        />
      </div>
      
      <div className="space-y-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {t('company.address')}
              </Label>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('company.address.tip')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Input 
          placeholder={t('company.address')} 
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={cn(
            address ? "border-green-500 focus-visible:ring-green-500" : "",
            "transition-colors"
          )}
        />
      </div>
      
      <div className="space-y-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t('contact.person')}
              </Label>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('contact.person.tip')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Input 
          placeholder={t('contact.person')}
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          className={cn(
            contactName ? "border-green-500 focus-visible:ring-green-500" : "",
            "transition-colors"
          )}
        />
      </div>
      
      <div className="space-y-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Label className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {t('contact.phone')}
              </Label>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('contact.phone.tip')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Input 
          placeholder={t('contact.phone')}
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          type="tel"
          dir="ltr"
          className={cn(
            contactPhone ? "border-green-500 focus-visible:ring-green-500" : "",
            "transition-colors"
          )}
        />
      </div>
      
      <div className="space-y-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {t('contact.email')}
              </Label>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('contact.email.tip')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Input 
          placeholder={t('contact.email')}
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          type="email"
          dir="ltr"
          className={cn(
            contactEmail ? "border-green-500 focus-visible:ring-green-500" : "",
            "transition-colors"
          )}
        />
      </div>
      
      <div className="space-y-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {t('survey.date')}
              </Label>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('survey.date.tip')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left",
                !surveyDate && "text-muted-foreground",
                surveyDate ? "border-green-500 focus-visible:ring-green-500" : "",
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {surveyDate ? format(surveyDate, "dd/MM/yyyy") : <span>{t('select.date')}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={surveyDate}
              onSelect={setSurveyDate}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Label className="flex items-center gap-2">
                <List className="h-4 w-4" />
                {t('survey.status')}
              </Label>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('survey.status.tip')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Select
          value={surveyStatus}
          onValueChange={setSurveyStatus}
        >
          <SelectTrigger 
            className={cn(
              surveyStatus ? "border-green-500 focus-visible:ring-green-500" : "",
              "transition-colors"
            )}
          >
            <SelectValue placeholder={t('survey.status')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="פתוח">{t('status.open')}</SelectItem>
            <SelectItem value="בטיפול">{t('status.in.progress')}</SelectItem>
            <SelectItem value="הושלם">{t('status.completed')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

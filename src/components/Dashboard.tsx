
import React, { useState } from 'react';
import { ImageUploader } from './ImageUploader';
import { ReportList } from './ReportList';
import { ReportExport } from './ReportExport';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building, MapPin, User, Phone, Mail, Calendar, List } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export function Dashboard() {
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [surveyDate, setSurveyDate] = useState<Date | undefined>(new Date());
  const [surveyStatus, setSurveyStatus] = useState('פתוח');

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">סקר בטיחות</h1>
        <img 
          src="/lovable-uploads/26b58140-d09a-43b7-b02a-4365f061cc76.png"
          alt="לוגו"
          className="h-16 object-contain"
        />
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Label className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      שם חברה
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>הזן את שם החברה המלא</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Input 
                placeholder="הזן שם חברה" 
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
                      כתובת
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>הזן את כתובת החברה המלאה</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Input 
                placeholder="הזן כתובת" 
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
                      איש קשר
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>הזן את שם איש הקשר בחברה</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Input 
                placeholder="הזן שם איש קשר"
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
                      טלפון איש קשר
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>הזן מספר טלפון ליצירת קשר</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Input 
                placeholder="הזן מספר טלפון"
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
                      אימייל איש קשר
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>הזן כתובת דוא"ל ליצירת קשר</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Input 
                placeholder="הזן כתובת אימייל"
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
                      תאריך פתיחת הסקר
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>בחר את תאריך פתיחת הסקר</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-right",
                      !surveyDate && "text-muted-foreground",
                      surveyDate ? "border-green-500 focus-visible:ring-green-500" : "",
                    )}
                  >
                    <Calendar className="ml-2 h-4 w-4" />
                    {surveyDate ? format(surveyDate, "dd/MM/yyyy") : <span>בחר תאריך</span>}
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
                      סטטוס טיפול
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>בחר את סטטוס הטיפול בסקר</p>
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
                  <SelectValue placeholder="בחר סטטוס" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="פתוח">פתוח</SelectItem>
                  <SelectItem value="בטיפול">בטיפול</SelectItem>
                  <SelectItem value="הושלם">הושלם</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4">
          <h2 className="text-xl font-semibold mb-4">העלאת תמונה</h2>
          <ImageUploader />
          <div className="mt-6">
            <ReportExport 
              companyDetails={{
                name: companyName,
                address,
                contactName,
                contactPhone,
                contactEmail,
                surveyDate,
                surveyStatus
              }}
            />
          </div>
        </div>
        
        <div className="md:col-span-8">
          <h2 className="text-xl font-semibold mb-4">פריטי הדוח</h2>
          <ReportList />
        </div>
      </div>
    </div>
  );
}

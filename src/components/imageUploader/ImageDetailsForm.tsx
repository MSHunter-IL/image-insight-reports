
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileSearch } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { ImageDetailsFormProps } from '@/types/imageUploader';
import { useLanguage } from '@/context/LanguageContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

export function ImageDetailsForm({ 
  file, 
  onUpdate, 
  onAnalyze, 
  isAnalyzing,
  suggestedDescriptions 
}: ImageDetailsFormProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Label htmlFor="topic">{t('topic')}</Label>
            </TooltipTrigger>
            <TooltipContent>
              <p>הזן נושא הקשור לממצא</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Input
          id="topic"
          value={file.topic}
          onChange={(e) => onUpdate('topic', e.target.value)}
          placeholder="נושא הממצא"
          dir="rtl"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Label htmlFor="description">{t('description')}</Label>
              </TooltipTrigger>
              <TooltipContent>
                <p>תאר את הממצא בפירוט</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="text-xs flex items-center gap-1"
          >
            {isAnalyzing ? (
              <Spinner className="h-3 w-3 mr-1" />
            ) : (
              <FileSearch className="h-3 w-3 mr-1" />
            )}
            {isAnalyzing ? t('analyzing') : t('analyze.image')}
          </Button>
        </div>
        <div className="relative">
          <Textarea
            id="description"
            value={file.description}
            onChange={(e) => onUpdate('description', e.target.value)}
            placeholder={t('enter.description')}
            className="resize-none"
            rows={3}
            dir="rtl"
          />
          {suggestedDescriptions.length > 0 && file.description === '' && (
            <div className="absolute top-full mt-1 w-full bg-white z-10 border rounded-md shadow-md">
              {suggestedDescriptions.map((suggestion, i) => (
                <div 
                  key={i}
                  className="p-2 hover:bg-muted cursor-pointer text-sm"
                  onClick={() => onUpdate('description', suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Label htmlFor="urgency">{t('urgency')}</Label>
              </TooltipTrigger>
              <TooltipContent>
                <p>בחר רמת דחיפות לטיפול בממצא</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Select
            value={file.urgency}
            onValueChange={(value) => onUpdate('urgency', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('select.urgency')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="גבוהה">גבוהה</SelectItem>
              <SelectItem value="בינונית">בינונית</SelectItem>
              <SelectItem value="נמוכה">נמוכה</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Label htmlFor="category">{t('category')}</Label>
              </TooltipTrigger>
              <TooltipContent>
                <p>סווג את התמונה לקטגוריה מתאימה</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Select
            value={file.category}
            onValueChange={(value) => onUpdate('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('select.category')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="חוץ">חוץ</SelectItem>
              <SelectItem value="פנים">פנים</SelectItem>
              <SelectItem value="מסמכים">מסמכים</SelectItem>
              <SelectItem value="תשתיות">תשתיות</SelectItem>
              <SelectItem value="אחר">אחר</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

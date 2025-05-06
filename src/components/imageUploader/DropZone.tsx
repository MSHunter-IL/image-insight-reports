
import React from 'react';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DropZoneProps } from '@/types/imageUploader';
import { useLanguage } from '@/context/LanguageContext';

export function DropZone({ onFilesSelect, isDragging }: DropZoneProps) {
  const { t } = useLanguage();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesSelect(e.target.files);
    }
  };

  return (
    <div 
      className={cn(
        "border-2 border-dashed rounded-lg p-8 mb-6 text-center transition-all",
        isDragging ? "border-primary bg-primary/10 scale-105" : "border-input hover:border-primary/50 hover:bg-muted/30",
      )}
    >
      <div className="space-y-4">
        <div className="bg-primary/10 rounded-full p-3 w-16 h-16 mx-auto">
          <Upload className="h-10 w-10 mx-auto text-primary" />
        </div>
        <div className="space-y-2">
          <p className="text-lg font-medium">{t('upload.description')}</p>
          <p className="text-muted-foreground">
            {t('image.upload.drag')} {' '}
            <label 
              htmlFor="image-upload" 
              className="cursor-pointer text-primary hover:underline font-medium"
            >
              {t('image.upload.select')}
            </label>
          </p>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}


import React from 'react';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DropZoneProps } from '@/types/imageUploader';

export function DropZone({ onFilesSelect, isDragging }: DropZoneProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesSelect(e.target.files);
    }
  };

  return (
    <div 
      className={cn(
        "border-2 border-dashed rounded-md p-6 mb-4 text-center transition-colors",
        isDragging ? "border-primary bg-primary/5" : "border-input hover:border-primary/50",
      )}
    >
      <div className="space-y-4">
        <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
        <div>
          <p className="text-muted-foreground">גרור תמונות לכאן או</p>
          <label 
            htmlFor="image-upload" 
            className="cursor-pointer text-primary hover:underline"
          >
            בחר קבצים
          </label>
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

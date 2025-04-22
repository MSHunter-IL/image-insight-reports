
import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { ImagePreviewProps } from '@/types/imageUploader';

export function ImagePreview({ files, activeIndex, onSelect, onRemove }: ImagePreviewProps) {
  if (files.length === 0) return null;

  return (
    <div className="mb-6">
      <Label className="mb-2 block">תמונות נבחרות ({files.length})</Label>
      <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto">
        {files.map((file, index) => (
          <div 
            key={index} 
            className={cn(
              "relative h-16 w-16 rounded-md border overflow-hidden cursor-pointer",
              index === activeIndex ? "ring-2 ring-primary" : ""
            )}
            onClick={() => onSelect(index)}
          >
            <img 
              src={file.preview} 
              alt={`Preview ${index}`} 
              className="h-full w-full object-cover"
            />
            <button 
              className="absolute top-0 right-0 bg-black/50 rounded-bl-md p-1"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(index);
              }}
            >
              <X className="h-3 w-3 text-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

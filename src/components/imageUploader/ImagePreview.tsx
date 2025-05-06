
import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { ImagePreviewProps } from '@/types/imageUploader';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';

export function ImagePreview({ files, activeIndex, onSelect, onRemove }: ImagePreviewProps) {
  const { t } = useLanguage();
  
  if (files.length === 0) return null;

  return (
    <div className="mb-6">
      <Label className="mb-2 block font-medium">{t('image.attached')} ({files.length})</Label>
      <div className="flex flex-wrap gap-3 mb-4 overflow-x-auto p-1">
        {files.map((file, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "relative h-20 w-20 rounded-md border overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all thumbnail-hover",
              index === activeIndex ? "ring-2 ring-primary ring-offset-2" : ""
            )}
            onClick={() => onSelect(index)}
          >
            <img 
              src={file.preview} 
              alt={`Preview ${index}`} 
              className="h-full w-full object-cover"
            />
            <button 
              className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 rounded-full p-1 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(index);
              }}
              aria-label="Remove image"
            >
              <X className="h-3 w-3 text-white" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

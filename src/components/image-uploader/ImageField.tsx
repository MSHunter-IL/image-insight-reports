
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ImageFieldProps {
  preview: string | null;
  file: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ImageField({ preview, onChange }: ImageFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="image">תמונה</Label>
      <div className="flex items-center gap-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={onChange}
            className="cursor-pointer"
          />
        </div>
        {preview && (
          <div className="h-20 w-20 overflow-hidden rounded-md border border-gray-200">
            <img 
              src={preview} 
              alt="Preview" 
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}

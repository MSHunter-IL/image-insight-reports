
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { FileSearch } from 'lucide-react';

interface DescriptionFieldProps {
  description: string;
  setDescription: (v: string) => void;
  handleAnalyzeImage: () => void;
  preview: string | null;
  isAnalyzing: boolean;
}

export function DescriptionField({
  description,
  setDescription,
  handleAnalyzeImage,
  preview,
  isAnalyzing
}: DescriptionFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="description">תיאור</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={handleAnalyzeImage}
          disabled={!preview || isAnalyzing}
          className="text-xs flex items-center gap-1"
        >
          {isAnalyzing ? (
            <Spinner className="h-3 w-3 mr-1" />
          ) : (
            <FileSearch className="h-3 w-3 mr-1" />
          )}
          {isAnalyzing ? "מנתח..." : "נתח תמונה"}
        </Button>
      </div>
      <Textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="תיאור הממצא"
        className="resize-none"
        rows={3}
        dir="rtl"
      />
    </div>
  );
}

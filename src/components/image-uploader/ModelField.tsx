
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { GroqModel } from '@/utils/groqApi';

interface ModelFieldProps {
  selectedModel: GroqModel;
  setSelectedModel: (model: GroqModel) => void;
}
export function ModelField({ selectedModel, setSelectedModel }: ModelFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="model">מודל לניתוח</Label>
      <Select
        value={selectedModel}
        onValueChange={(value) => setSelectedModel(value as GroqModel)}
      >
        <SelectTrigger>
          <SelectValue placeholder="בחר מודל" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="meta-llama/llama-4-scout-17b-16e-instruct">Llama 4 Scout (17B)</SelectItem>
          <SelectItem value="meta-llama/llama-3.1-8b-instruct">Llama 3.1 (8B)</SelectItem>
          <SelectItem value="mixtral-8x7b-32768">Mixtral 8x7B</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

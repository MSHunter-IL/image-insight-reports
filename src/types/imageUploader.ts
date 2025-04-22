
import { UrgencyLevel, ImageCategory } from './report';

export interface FileWithPreview {
  file: File;
  preview: string;
  topic: string;
  description: string;
  urgency: UrgencyLevel;
  category: ImageCategory;
}

export interface ImageDetailsFormProps {
  file: FileWithPreview;
  onUpdate: (field: keyof FileWithPreview, value: any) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  suggestedDescriptions: string[];
}

export interface ImagePreviewProps {
  files: FileWithPreview[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onRemove: (index: number) => void;
}

export interface DropZoneProps {
  onFilesSelect: (files: FileList) => void;
  isDragging: boolean;
}


import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

import { useImageUploaderLogic } from './image-uploader/useImageUploaderLogic';
import { ImageField } from './image-uploader/ImageField';
import { ModelField } from './image-uploader/ModelField';
import { DescriptionField } from './image-uploader/DescriptionField';
import { TopicField } from './image-uploader/TopicField';
import { UrgencyField } from './image-uploader/UrgencyField';

export function ImageUploader() {
  const {
    file,
    preview,
    topic,
    description,
    urgency,
    isAnalyzing,
    selectedModel,
    setTopic,
    setDescription,
    setUrgency,
    setSelectedModel,
    handleFileChange,
    handleAnalyzeImage,
    handleSubmit,
  } = useImageUploaderLogic();

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <ImageField preview={preview} file={file} onChange={handleFileChange} />
          <ModelField selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
          <DescriptionField description={description} setDescription={setDescription} handleAnalyzeImage={handleAnalyzeImage} preview={preview} isAnalyzing={isAnalyzing} />
          <TopicField topic={topic} setTopic={setTopic} />
          <UrgencyField urgency={urgency} setUrgency={setUrgency} />
          <Button type="submit" className="w-full" disabled={!file}>
            <Upload className="ml-2 h-4 w-4" />
            הוסף לדוח
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

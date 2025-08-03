
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { useReport } from '@/context/ReportContext';
import { useToast } from '@/components/ui/use-toast';
import { analyzeImage } from '@/utils/groqApi';
import { FileWithPreview } from '@/types/imageUploader';
import { DropZone } from './imageUploader/DropZone';
import { ImagePreview } from './imageUploader/ImagePreview';
import { ImageDetailsForm } from './imageUploader/ImageDetailsForm';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { UrgencyLevel, ImageCategory, StatusType } from '@/types/report';

export function ImageUploader() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { addEntry } = useReport();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { remainingFreeReports, handleReportCreation, showSubscriptionDialog } = useSubscription();

  // תיאורים מוצעים דינמיים
  const getSuggestedDescriptions = () => {
    return [
      "סדק בקיר המבנה המערבי",
      "חוסר במעקה בטיחות בגרם המדרגות",
      "חיווט חשמלי חשוף במסדרון קומה 2",
      "חוסר בשילוט בטיחות באזור המחסנים",
      "דליפת מים מצינור במרתף"
    ];
  };

  const handleFilesSelect = (selectedFiles: FileList) => {
    const newFilesArray: FileWithPreview[] = [];
    
    Array.from(selectedFiles).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      
      const nameParts = file.name.split('.');
      nameParts.pop();
      const topicFromName = nameParts.join('.').substring(0, 30) || 'ממצא חדש';
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const newFile: FileWithPreview = {
          file,
          preview: event.target?.result as string,
          topic: topicFromName,
          description: '',
          urgency: 'בינונית' as UrgencyLevel,
          category: 'אחר' as ImageCategory
        };
        
        newFilesArray.push(newFile);
        if (newFilesArray.length === selectedFiles.length) {
          setFiles(prevFiles => {
            const updatedFiles = [...prevFiles, ...newFilesArray];
            if (prevFiles.length === 0) {
              setActiveFileIndex(0);
            }
            return updatedFiles;
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAnalyzeImage = async () => {
    if (files.length === 0) {
      toast({
        title: "שגיאה",
        description: "יש לבחור תמונה תחילה",
        variant: "destructive"
      });
      return;
    }

    const activeFile = files[activeFileIndex];
    console.log("🔍 מתחיל ניתוח תמונה:", {
      fileIndex: activeFileIndex,
      fileName: activeFile?.file?.name,
      hasPreview: !!activeFile?.preview,
      currentDescription: activeFile?.description,
      language
    });

    setIsAnalyzing(true);
    try {
      // העבר את פרמטר השפה כדי להבטיח שהניתוח נעשה בשפה הנכונה
      const analysis = await analyzeImage(activeFile.preview, activeFile.description, language);
      
      console.log("✅ תוצאות ניתוח התמונה:", {
        analysis,
        originalDescription: activeFile.description,
        newDescription: analysis.description,
        suggestedUrgency: analysis.suggestedUrgency,
        suggestedTopic: analysis.suggestedTopic
      });
      
      const updatedFiles = [...files];
      updatedFiles[activeFileIndex] = {
        ...activeFile,
        description: analysis.description || 'אין תיאור',
        urgency: (analysis.suggestedUrgency || 'בינונית') as UrgencyLevel,
        topic: analysis.suggestedTopic || 'ממצא חדש'
      };
      
      console.log("📝 עדכון הקובץ:", {
        beforeUpdate: activeFile,
        afterUpdate: updatedFiles[activeFileIndex]
      });
      
      setFiles(updatedFiles);

      toast({
        title: "ניתוח הושלם",
        description: "התמונה נותחה בהצלחה",
      });
    } catch (error) {
      console.error("❌ שגיאה בניתוח התמונה:", error);
      toast({
        title: "שגיאה בניתוח",
        description: "לא ניתן לנתח את התמונה. נא להזין תיאור ידנית.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateActiveFile = (field: keyof FileWithPreview, value: any) => {
    if (files.length === 0) return;
    
    const updatedFiles = [...files];
    updatedFiles[activeFileIndex] = {
      ...updatedFiles[activeFileIndex],
      [field]: value
    };
    
    setFiles(updatedFiles);
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      
      if (newFiles.length === 0) {
        setActiveFileIndex(0);
      } else if (activeFileIndex >= newFiles.length) {
        setActiveFileIndex(newFiles.length - 1);
      }
      
      return newFiles;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (files.length === 0) {
      toast({
        title: "שגיאה",
        description: "יש לבחור תמונה תחילה",
        variant: "destructive"
      });
      return;
    }

    // בדוק אם למשתמש נשארו דיווחים או שהוא צריך להירשם למנוי
    if (remainingFreeReports <= 0) {
      showSubscriptionDialog();
      return;
    }

    // רשום יצירת דיווח
    handleReportCreation(files.length);

    files.forEach(fileData => {
      addEntry({
        topic: fileData.topic || 'ממצא בטיחות',
        description: fileData.description || 'אין תיאור',
        urgency: fileData.urgency as UrgencyLevel,
        status: 'טרם טופל' as StatusType,
        imageUrl: fileData.preview,
        imageFile: fileData.file,
        category: fileData.category as ImageCategory
      });
    });

    setFiles([]);
    setActiveFileIndex(0);
    
    toast({
      title: "הוספו לדוח",
      description: `${files.length} פריטים נוספו לדוח בהצלחה`,
    });
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFilesSelect(e.dataTransfer.files);
  }, []);

  return (
    <Card className="w-full">
      <CardContent className="pt-6 pb-2">
        {/* הצג מונה דוחות חינמיים אם המשתמש מחובר */}
        {user && (
          <div className="mb-4 flex justify-between items-center">
            <div className="text-sm font-medium">
              {t('free.reports.remaining')}{' '}
              <span className="text-primary">{remainingFreeReports}</span>
            </div>
          </div>
        )}
        
        <div 
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <DropZone 
            onFilesSelect={handleFilesSelect}
            isDragging={isDragging}
          />
        </div>

        <ImagePreview
          files={files}
          activeIndex={activeFileIndex}
          onSelect={setActiveFileIndex}
          onRemove={removeFile}
        />

        {files.length > 0 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <ImageDetailsForm
              file={files[activeFileIndex]}
              onUpdate={updateActiveFile}
              onAnalyze={handleAnalyzeImage}
              isAnalyzing={isAnalyzing}
              suggestedDescriptions={getSuggestedDescriptions()}
            />

            <Button type="submit" className="w-full">
              <Upload className="ml-2 h-4 w-4" />
              {`הוסף ${files.length > 1 ? `${files.length} תמונות` : "תמונה"} לדוח`}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

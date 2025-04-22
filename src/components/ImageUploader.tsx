
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileSearch, Trash2, Folder, Image, X } from 'lucide-react';
import { useReport } from '@/context/ReportContext';
import { UrgencyLevel, StatusType } from '@/types/report';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { analyzeImage } from '@/utils/groqApi';
import { Spinner } from '@/components/ui/spinner';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type ImageCategory = 'חוץ' | 'פנים' | 'מסמכים' | 'תשתיות' | 'אחר';

interface FileWithPreview {
  file: File;
  preview: string;
  topic: string;
  description: string;
  urgency: UrgencyLevel;
  category: ImageCategory;
}

export function ImageUploader() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { addEntry } = useReport();
  const { toast } = useToast();

  const handleFilesSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFilesArray: FileWithPreview[] = [];
    
    Array.from(selectedFiles).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      
      // Extract topic from filename
      const nameParts = file.name.split('.');
      nameParts.pop(); // Remove extension
      const topicFromName = nameParts.join('.').substring(0, 30) || 'ממצא חדש';
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const newFile: FileWithPreview = {
          file,
          preview: event.target?.result as string,
          topic: topicFromName,
          description: '',
          urgency: 'בינונית',
          category: 'אחר'
        };
        
        newFilesArray.push(newFile);
        if (newFilesArray.length === selectedFiles.length) {
          setFiles(prev => [...prev, ...newFilesArray]);
          if (prev.length === 0) {
            setActiveFileIndex(0);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilesSelect(e.target.files);
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

    setIsAnalyzing(true);
    try {
      const analysis = await analyzeImage(activeFile.preview, activeFile.description);
      
      // Update the active file with analysis results
      const updatedFiles = [...files];
      updatedFiles[activeFileIndex] = {
        ...activeFile,
        description: analysis.description || 'אין תיאור',
        urgency: analysis.suggestedUrgency || 'בינונית',
        topic: analysis.suggestedTopic || 'ממצא חדש'
      };
      
      setFiles(updatedFiles);

      toast({
        title: "ניתוח הושלם",
        description: "התמונה נותחה בהצלחה",
      });
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast({
        title: "שגיאה בניתוח",
        description: "לא ניתן לנתח את התמונה. נא הזן תיאור ידני.",
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
    setFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      
      // Update active index if needed
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

    // Add all files to report
    files.forEach(fileData => {
      addEntry({
        topic: fileData.topic || 'ממצא בטיחות',
        description: fileData.description || 'אין תיאור',
        urgency: fileData.urgency,
        status: 'טרם טופל',
        imageUrl: fileData.preview,
        imageFile: fileData.file,
        category: fileData.category
      });
    });

    // Reset form
    setFiles([]);
    setActiveFileIndex(0);
    
    toast({
      title: "הוספו לדוח",
      description: `${files.length} פריטים נוספו לדוח בהצלחה`,
    });
  };

  // Drag and drop handlers
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

  // Auto-suggest descriptions based on previous entries
  const suggestedDescriptions = [
    "סדק בקיר המבנה המערבי",
    "חוסר במעקה בטיחות בגרם המדרגות",
    "חיווט חשמלי חשוף במסדרון קומה 2",
    "חוסר בשילוט בטיחות באזור המחסנים",
    "דליפת מים מצינור במרתף"
  ];

  return (
    <Card className="w-full">
      <CardContent className="pt-6 pb-2">
        <div 
          className={cn(
            "border-2 border-dashed rounded-md p-6 mb-4 text-center transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-input hover:border-primary/50",
          )}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
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

        {files.length > 0 && (
          <div className="mb-6">
            <Label className="mb-2 block">תמונות נבחרות ({files.length})</Label>
            <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto">
              {files.map((file, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "relative h-16 w-16 rounded-md border overflow-hidden cursor-pointer",
                    index === activeFileIndex ? "ring-2 ring-primary" : ""
                  )}
                  onClick={() => setActiveFileIndex(index)}
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
                      removeFile(index);
                    }}
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {files.length > 0 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Label htmlFor="topic">נושא</Label>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>הזן נושא הקשור לממצא</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Input
                id="topic"
                value={files[activeFileIndex]?.topic || ''}
                onChange={(e) => updateActiveFile('topic', e.target.value)}
                placeholder="נושא הממצא"
                dir="rtl"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label htmlFor="description">תיאור</Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>תאר את הממצא בפירוט</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleAnalyzeImage}
                  disabled={files.length === 0 || isAnalyzing}
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
              <div className="relative">
                <Textarea
                  id="description"
                  value={files[activeFileIndex]?.description || ''}
                  onChange={(e) => updateActiveFile('description', e.target.value)}
                  placeholder="תיאור הממצא"
                  className="resize-none"
                  rows={3}
                  dir="rtl"
                />
                {suggestedDescriptions.length > 0 && files[activeFileIndex]?.description === '' && (
                  <div className="absolute top-full mt-1 w-full bg-white z-10 border rounded-md shadow-md">
                    {suggestedDescriptions.map((suggestion, i) => (
                      <div 
                        key={i}
                        className="p-2 hover:bg-muted cursor-pointer text-sm"
                        onClick={() => updateActiveFile('description', suggestion)}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label htmlFor="urgency">דחיפות</Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>בחר רמת דחיפות לטיפול בממצא</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Select
                  value={files[activeFileIndex]?.urgency || 'בינונית'}
                  onValueChange={(value) => updateActiveFile('urgency', value as UrgencyLevel)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר דחיפות" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="גבוהה">גבוהה</SelectItem>
                    <SelectItem value="בינונית">בינונית</SelectItem>
                    <SelectItem value="נמוכה">נמוכה</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Label htmlFor="category">קטגוריה</Label>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>סווג את התמונה לקטגוריה מתאימה</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Select
                  value={files[activeFileIndex]?.category || 'אחר'}
                  onValueChange={(value) => updateActiveFile('category', value as ImageCategory)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר קטגוריה" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="חוץ">חוץ</SelectItem>
                    <SelectItem value="פנים">פנים</SelectItem>
                    <SelectItem value="מסמכים">מסמכים</SelectItem>
                    <SelectItem value="תשתיות">תשתיות</SelectItem>
                    <SelectItem value="אחר">אחר</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full">
              <Upload className="ml-2 h-4 w-4" />
              הוסף {files.length > 1 ? `${files.length} תמונות` : "תמונה"} לדוח
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

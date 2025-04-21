
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileSearch } from 'lucide-react';
import { useReport } from '@/context/ReportContext';
import { UrgencyLevel, StatusType } from '@/types/report';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { analyzeImage } from '@/utils/groqApi';
import { Spinner } from '@/components/ui/spinner';

export function ImageUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('בינונית');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { addEntry } = useReport();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Extract topic from filename if not set
      if (!topic) {
        const nameParts = selectedFile.name.split('.');
        nameParts.pop(); // Remove extension
        setTopic(nameParts.join('.').substring(0, 30));
      }
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyzeImage = async () => {
    if (!preview) {
      toast({
        title: "שגיאה",
        description: "יש לבחור תמונה תחילה",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const analysis = await analyzeImage(preview, description);
      setDescription(analysis.description);
      setUrgency(analysis.suggestedUrgency);
      
      // Use the dedicated topic from the analysis
      setTopic(analysis.suggestedTopic);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !preview) {
      toast({
        title: "שגיאה",
        description: "יש לבחור תמונה תחילה",
        variant: "destructive"
      });
      return;
    }

    if (!topic) {
      setTopic('ממצא בטיחות');
    }

    addEntry({
      topic: topic || 'ממצא בטיחות',
      description: description || 'אין תיאור',
      urgency,
      status: 'טרם טופל',
      imageUrl: preview,
      imageFile: file
    });

    // Reset form
    setFile(null);
    setPreview(null);
    setTopic('');
    setDescription('');
    setUrgency('בינונית');
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">תמונה</Label>
            <div className="flex items-center gap-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
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

          <div className="space-y-2">
            <Label htmlFor="topic">נושא</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="נושא הממצא"
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="urgency">דחיפות</Label>
            <Select
              value={urgency}
              onValueChange={(value) => setUrgency(value as UrgencyLevel)}
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

          <Button type="submit" className="w-full" disabled={!file}>
            <Upload className="ml-2 h-4 w-4" />
            הוסף לדוח
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

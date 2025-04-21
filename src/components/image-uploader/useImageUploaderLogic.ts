
import { useState } from 'react';
import { UrgencyLevel, StatusType } from '@/types/report';
import { useReport } from '@/context/ReportContext';
import { useToast } from '@/components/ui/use-toast';
import { analyzeImage, GroqModel } from '@/utils/groqApi';

export function useImageUploaderLogic() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('בינונית');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedModel, setSelectedModel] = useState<GroqModel>('meta-llama/llama-4-scout-17b-16e-instruct');
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
      const analysis = await analyzeImage(preview, description, selectedModel);
      setDescription(analysis.description);
      setUrgency(analysis.suggestedUrgency);
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

  return {
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
    setFile
  };
}

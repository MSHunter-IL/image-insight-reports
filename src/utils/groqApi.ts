
import { supabase } from '@/integrations/supabase/client';

interface ImageAnalysisResponse {
  description: string;
  suggestedUrgency: string;
  suggestedTopic: string;
}

export const analyzeImage = async (imageData: string, userDescription?: string, language?: string): Promise<ImageAnalysisResponse> => {
  try {
    console.log("📤 שליחת בקשה לניתוח תמונה:", {
      hasImageData: !!imageData,
      imageDataLength: imageData?.length,
      userDescription,
      language
    });

    const { data, error } = await supabase.functions.invoke('analyze-image', {
      body: {
        imageData,
        userDescription,
        language
      }
    });

    console.log("📥 תגובה מהשרת:", {
      data,
      error,
      hasData: !!data
    });

    if (error) {
      console.error('❌ שגיאה בקריאה לפונקציית ניתוח התמונה:', error);
      throw new Error('Failed to analyze image');
    }

    if (!data) {
      console.error('❌ לא התקבלו נתונים מהשרת');
      throw new Error('No data received from server');
    }

    console.log("✅ ניתוח התמונה הושלם בהצלחה:", data);
    return data;
  } catch (error) {
    console.error('❌ שגיאה כללית בניתוח התמונה:', error);
    throw error;
  }
};


import { supabase } from '@/integrations/supabase/client';

interface ImageAnalysisResponse {
  description: string;
  suggestedUrgency: string;
  suggestedTopic: string;
}

export const analyzeImage = async (imageData: string, userDescription?: string, language?: string): Promise<ImageAnalysisResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-image', {
      body: {
        imageData,
        userDescription,
        language
      }
    });

    if (error) {
      console.error('Error calling analyze-image function:', error);
      throw new Error('Failed to analyze image');
    }

    return data;
  } catch (error) {
    console.error('Error in analyzeImage:', error);
    throw error;
  }
};

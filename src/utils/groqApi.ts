
import { UrgencyLevel } from '@/types/report';

// This is a placeholder for the API key. In a production environment, this should be handled securely.
// For demo purposes, we'll store it here, but in production it should be in a backend service.
const GROQ_API_KEY = "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";

export async function analyzeImage(imageUrl: string): Promise<{
  description: string;
  suggestedUrgency: UrgencyLevel;
}> {
  try {
    const base64Image = imageUrl.split(',')[1];
    
    // First, let's convert the image to a base64 URL that Groq can handle
    const imageContent = `data:image/jpeg;base64,${base64Image}`;
    
    // Format the request according to the Groq API requirements
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You are a safety inspector analyzing images. Provide a brief description of safety issues visible in the image and suggest an urgency level (גבוהה/בינונית/נמוכה). Return your answer in JSON format with 'description' and 'urgency' keys. The 'description' should be in Hebrew and describe the safety issue in around 15-30 words. The 'urgency' key should be exactly one of these values: 'גבוהה', 'בינונית', or 'נמוכה' based on how critical the safety issue appears."
          },
          {
            role: "user",
            content: `Analyze this safety-related image: ${imageContent}`
          }
        ],
        model: "llama-3.3-70b-versatile",
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const result = await response.json();
    const content = result.choices[0]?.message?.content;
    
    try {
      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : null;
      
      if (jsonStr) {
        const parsedData = JSON.parse(jsonStr);
        return {
          description: parsedData.description || "לא זוהה תיאור בתמונה",
          suggestedUrgency: (parsedData.urgency as UrgencyLevel) || "בינונית"
        };
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
    }
    
    // Fallback if JSON parsing fails
    return {
      description: "לא ניתן לנתח את התמונה. נא הזן תיאור ידני.",
      suggestedUrgency: "בינונית"
    };
  } catch (error) {
    console.error("Error analyzing image:", error);
    return {
      description: "שגיאה בניתוח התמונה. נא הזן תיאור ידני.",
      suggestedUrgency: "בינונית"
    };
  }
}

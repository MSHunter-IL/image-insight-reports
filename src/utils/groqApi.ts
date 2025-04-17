
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
            content: [
              {
                type: "text",
                text: "Analyze this safety-related image and identify potential hazards or safety issues."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const result = await response.json();
    const content = result.choices[0]?.message?.content;
    
    // Parse the JSON directly
    try {
      const parsedData = JSON.parse(content);
      return {
        description: parsedData.description || "לא זוהה תיאור בתמונה",
        suggestedUrgency: parsedData.urgency || "בינונית"
      };
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      
      // Fallback parsing attempt
      const descriptions = content.match(/"description"\s*:\s*"([^"]+)"/);
      const urgencies = content.match(/"urgency"\s*:\s*"([^"]+)"/);

      return {
        description: descriptions ? descriptions[1] : "לא ניתן לנתח את התמונה. נא הזן תיאור ידני.",
        suggestedUrgency: urgencies ? urgencies[1] as UrgencyLevel : "בינונית"
      };
    }
  } catch (error) {
    console.error("Error analyzing image:", error);
    return {
      description: "שגיאה בניתוח התמונה. נא הזן תיאור ידני.",
      suggestedUrgency: "בינונית"
    };
  }
}

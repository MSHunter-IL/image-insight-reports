
import { UrgencyLevel } from '@/types/report';

// This is a placeholder for the API key. In a production environment, this should be handled securely.
// For demo purposes, we'll store it here, but in production it should be in a backend service.
const GROQ_API_KEY = "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";

export async function analyzeImage(imageUrl: string, userDescription?: string): Promise<{
  description: string;
  suggestedUrgency: UrgencyLevel;
  suggestedTopic: string;
}> {
  try {
    const base64Image = imageUrl.split(',')[1];
    
    const systemPrompt = userDescription 
      ? `You are a safety inspector analyzing images. Consider this additional context from the user: "${userDescription}". 
      Provide a detailed description of safety issues visible in the image, incorporating the user's context. 
      Return your answer in JSON format with three keys: 
      1. 'topic' - A very brief title (2-3 words maximum) that summarizes the safety issue in Hebrew
      2. 'description' - A detailed description in Hebrew (25-50 words) of the safety issue
      3. 'urgency' - The urgency level, which must be exactly one of these values: 'גבוהה', 'בינונית', or 'נמוכה'
      
      Important: Make sure the topic is much shorter than the description and clearly different. The text should follow RTL (right-to-left) conventions for Hebrew, with proper spacing between words.`
      
      : `You are a safety inspector analyzing images. Provide a brief description of safety issues visible in the image and suggest an urgency level. 
      Return your answer in JSON format with three keys: 
      1. 'topic' - A very brief title (2-3 words maximum) that summarizes the safety issue in Hebrew
      2. 'description' - A detailed description in Hebrew (25-50 words) of the safety issue
      3. 'urgency' - The urgency level, which must be exactly one of these values: 'גבוהה', 'בינונית', or 'נמוכה'
      
      Important: Make sure the topic is much shorter than the description and clearly different. The text should follow RTL (right-to-left) conventions for Hebrew, with proper spacing between words.`;

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
            content: systemPrompt
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
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      console.error(`API request failed: ${response.status}`, await response.text());
      throw new Error(`API request failed: ${response.status}`);
    }

    const result = await response.json();
    const content = result.choices[0]?.message?.content;
    
    // Parse the JSON directly
    try {
      const parsedData = JSON.parse(content);
      return {
        description: parsedData.description || "לא זוהה תיאור בתמונה",
        suggestedUrgency: parsedData.urgency || "בינונית",
        suggestedTopic: parsedData.topic || "ממצא בטיחות"
      };
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError, content);
      
      // Fallback parsing attempt
      const topics = content.match(/"topic"\s*:\s*"([^"]+)"/);
      const descriptions = content.match(/"description"\s*:\s*"([^"]+)"/);
      const urgencies = content.match(/"urgency"\s*:\s*"([^"]+)"/);

      return {
        description: descriptions ? descriptions[1] : "לא ניתן לנתח את התמונה. נא הזן תיאור ידני.",
        suggestedUrgency: urgencies ? urgencies[1] as UrgencyLevel : "בינונית",
        suggestedTopic: topics ? topics[1] : "ממצא בטיחות"
      };
    }
  } catch (error) {
    console.error("Error analyzing image:", error);
    return {
      description: "שגיאה בניתוח התמונה. נא הזן תיאור ידני.",
      suggestedUrgency: "בינונית",
      suggestedTopic: "ממצא בטיחות"
    };
  }
}


import { UrgencyLevel } from '@/types/report';

// This is a placeholder for the API key. In a production environment, this should be handled securely.
// For demo purposes, we'll store it here, but in production it should be in a backend service.
const GROQ_API_KEY = "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";

export type GroqModel = 'meta-llama/llama-4-scout-17b-16e-instruct' | 'meta-llama/llama-3.1-8b-instruct' | 'mixtral-8x7b-32768';

export async function analyzeImage(
  imageUrl: string, 
  userDescription?: string,
  model: GroqModel = 'meta-llama/llama-4-scout-17b-16e-instruct'
): Promise<{
  description: string;
  suggestedUrgency: UrgencyLevel;
  suggestedTopic: string;
}> {
  try {
    const base64Image = imageUrl.split(',')[1];
    
    const systemPrompt = userDescription 
      ? `אתה מפקח בטיחות המנתח תמונות. התייחס להקשר נוסף זה מהמשתמש: "${userDescription}". 
      ספק תיאור מפורט של בעיות הבטיחות הנראות בתמונה, תוך שילוב ההקשר של המשתמש. 
      החזר את התשובה שלך בפורמט JSON עם שלושה מפתחות: 
      1. 'topic' - כותרת קצרה מאוד (2-3 מילים לכל היותר) המסכמת את בעיית הבטיחות בעברית
      2. 'description' - תיאור מפורט בעברית (25-50 מילים) של בעיית הבטיחות
      3. 'urgency' - רמת הדחיפות, שחייבת להיות בדיוק אחד מהערכים הבאים: 'גבוהה', 'בינונית', או 'נמוכה'
      
      חשוב: ודא שהנושא קצר בהרבה מהתיאור ושונה בבירור ממנו. הטקסט צריך לעקוב אחר מוסכמות RTL (מימין לשמאל) עבור עברית, עם רווחים תקינים בין המילים.`
      
      : `אתה מפקח בטיחות המנתח תמונות. ספק תיאור קצר של בעיות הבטיחות הנראות בתמונה והצע רמת דחיפות. 
      החזר את התשובה שלך בפורמט JSON עם שלושה מפתחות: 
      1. 'topic' - כותרת קצרה מאוד (2-3 מילים לכל היותר) המסכמת את בעיית הבטיחות בעברית
      2. 'description' - תיאור מפורט בעברית (25-50 מילים) של בעיית הבטיחות
      3. 'urgency' - רמת הדחיפות, שחייבת להיות בדיוק אחד מהערכים הבאים: 'גבוהה', 'בינונית', או 'נמוכה'
      
      חשוב: ודא שהנושא קצר בהרבה מהתיאור ושונה בבירור ממנו. הטקסט צריך לעקוב אחר מוסכמות RTL (מימין לשמאל) עבור עברית, עם רווחים תקינים בין המילים.`;

    console.log(`Analyzing image with model: ${model}`);

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
                text: "נתח את תמונת הבטיחות הזו וזהה סכנות או בעיות בטיחות פוטנציאליות."
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
        model: model,
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

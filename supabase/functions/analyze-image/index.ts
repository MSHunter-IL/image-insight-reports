import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData, userDescription, language = 'english' } = await req.json();
    const groqApiKey = Deno.env.get('GROQ_API_KEY');

    if (!groqApiKey) {
      console.error('GROQ_API_KEY not found in environment');
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = language === 'hebrew' 
      ? `אתה ממונה בטיחות מקצועי עם 20 שנות ניסיון בזיהוי סכנות בטיחות במקומות עבודה. 
         נתח את התמונה בקפידה וזהה כל סכנת בטיחות אפשרית.
         
         התמקד ב:
         - סכנות נפילה (גובה, רצפות רטובות, מכשולים)
         - סכנות חשמל (כבלים חשופים, ציוד פגום)
         - ציוד מגן אישי חסר או לקוי
         - סכנות אש וחומרים מסוכנים
         - תנאי תאורה לא מספקים
         - עמידה בתקנות בטיחות
         - ארגון וסדר במקום העבודה
         
         כתב תיאור מפורט ומקצועי של הסכנות שזוהו והמלצות לתיקון.
         
         התגובה שלך צריכה להיות במבנה הבא:
         תיאור: [תיאור מפורט מקצועי של סכנות הבטיחות שזוהו והמלצות תיקון]
         דחיפות: [נמוכה/בינונית/גבוהה/קריטית]
         נושא: [קטגוריית הסכנה הראשית]`
      : `You are a professional safety manager with 20 years of experience in identifying workplace safety hazards.
         Carefully analyze this image and identify all possible safety hazards.
         
         Focus on:
         - Fall hazards (heights, wet floors, obstacles)
         - Electrical hazards (exposed wires, damaged equipment)
         - Missing or inadequate personal protective equipment
         - Fire and hazardous material risks
         - Inadequate lighting conditions
         - Safety regulation compliance
         - Workplace organization and order
         
         Write a detailed professional description of identified hazards and repair recommendations.
         
         Your response should be structured as:
         Description: [detailed professional description of safety hazards identified and repair recommendations]
         Urgency: [Low/Medium/High/Critical]
         Topic: [main hazard category]`;

    const userPrompt = userDescription 
      ? `Image analysis with additional context: ${userDescription}`
      : 'Please analyze this image for safety issues';

    console.log('Starting image analysis with Groq API');
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-maverick-17b-128e-instruct',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: userPrompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      console.error('Request failed with status:', response.status);
      return new Response(JSON.stringify({ error: 'Failed to analyze image' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('Groq API response received successfully');
    const content = data.choices[0].message.content;
    console.log('Analysis content:', content);

    // Parse the response to extract structured data
    const lines = content.split('\n');
    let description = '';
    let suggestedUrgency = '';
    let suggestedTopic = '';

    for (const line of lines) {
      if (line.includes('תיאור:') || line.includes('Description:')) {
        description = line.split(':')[1]?.trim() || '';
      } else if (line.includes('דחיפות:') || line.includes('Urgency:')) {
        suggestedUrgency = line.split(':')[1]?.trim() || '';
      } else if (line.includes('נושא:') || line.includes('Topic:')) {
        suggestedTopic = line.split(':')[1]?.trim() || '';
      }
    }

    // Fallback if structured parsing fails
    if (!description) {
      description = content;
      suggestedUrgency = language === 'hebrew' ? 'בינונית' : 'Medium';
      suggestedTopic = language === 'hebrew' ? 'בטיחות כללית' : 'General Safety';
    }

    console.log('Analysis completed successfully:', { description, suggestedUrgency, suggestedTopic });
    
    return new Response(JSON.stringify({
      description,
      suggestedUrgency,
      suggestedTopic
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-image function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
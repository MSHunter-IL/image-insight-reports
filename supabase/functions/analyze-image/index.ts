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
      ? `אתה מומחה בטיחות מקצועי. נתח את התמונה וספק תיאור מפורט של הסכנות והבעיות שאתה רואה. השב בעברית.
         התגובה שלך צריכה להיות במבנה הבא:
         תיאור: [תיאור מפורט של הבעיות]
         דחיפות: [נמוכה/בינונית/גבוהה/קריטית]
         נושא: [קטגוריה של הבעיה]`
      : `You are a professional safety expert. Analyze this image and provide a detailed description of any safety hazards or issues you can identify.
         Your response should be structured as:
         Description: [detailed description of issues]
         Urgency: [Low/Medium/High/Critical]
         Topic: [category of the issue]`;

    const userPrompt = userDescription 
      ? `Image analysis with additional context: ${userDescription}`
      : 'Please analyze this image for safety issues';

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llava-v1.5-7b-4096-preview',
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
      return new Response(JSON.stringify({ error: 'Failed to analyze image' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

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
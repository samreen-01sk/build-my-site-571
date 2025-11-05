import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image, mode = 'objects' } = await req.json();
    
    if (!image) {
      throw new Error('Image data is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log(`Calling Lovable AI for ${mode} detection...`);

    let systemPrompt = '';
    let userPrompt = '';

    if (mode === 'text') {
      systemPrompt = 'You are a text extraction assistant for visually impaired users. Extract ALL visible text from images accurately. Return ONLY a JSON object with the text. Example: {"text": "Hello World"}';
      userPrompt = 'Extract all visible text from this image. Include everything you can read.';
    } else if (mode === 'scene') {
      systemPrompt = 'You are a scene classification assistant for visually impaired users. Analyze the scene and provide a concise label and confidence score. Return ONLY a JSON object. Example: {"label": "indoor office", "confidence": 0.95}';
      userPrompt = 'Classify this scene with a brief label (e.g., "indoor office", "outdoor park", "street view", "kitchen", "bedroom") and a confidence score between 0 and 1.';
    } else {
      systemPrompt = 'You are an object detection assistant for visually impaired users. Analyze images and list ALL visible objects. Return ONLY a JSON array of object names, nothing else. Example: ["person", "chair", "table", "book"]';
      userPrompt = 'What objects do you see in this image? List all visible objects.';
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
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
                  url: image
                }
              }
            ]
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');
    
    const content = data.choices[0].message.content;
    console.log('Raw AI response:', content);
    
    if (mode === 'text') {
      // Parse text response
      let text = '';
      try {
        const jsonMatch = content.match(/\{.*\}/s);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          text = parsed.text || '';
        } else {
          text = content.trim();
        }
      } catch (parseError) {
        console.error('Error parsing text:', parseError);
        text = content.trim();
      }

      console.log('Detected text:', text);

      return new Response(
        JSON.stringify({ text }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (mode === 'scene') {
      // Parse scene label and confidence
      let label = 'unknown scene';
      let confidence = 0;
      try {
        const jsonMatch = content.match(/\{.*\}/s);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          label = parsed.label || 'unknown scene';
          confidence = parsed.confidence || 0;
        }
      } catch (parseError) {
        console.error('Error parsing scene data:', parseError);
      }

      console.log('Scene label:', label, 'Confidence:', confidence);

      return new Response(
        JSON.stringify({ label, confidence }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // Parse the JSON array from the response
      let objects: string[] = [];
      try {
        // Extract JSON array from the response
        const jsonMatch = content.match(/\[.*\]/s);
        if (jsonMatch) {
          objects = JSON.parse(jsonMatch[0]);
        } else {
          // Fallback: split by commas if not a proper JSON array
          objects = content.split(',').map((s: string) => s.trim().replace(/["\[\]]/g, ''));
        }
      } catch (parseError) {
        console.error('Error parsing objects:', parseError);
        // Fallback to splitting by common delimiters
        objects = content.split(/[,\n]/).map((s: string) => s.trim()).filter((s: string) => s.length > 0);
      }

      console.log('Detected objects:', objects);

      return new Response(
        JSON.stringify({ objects }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Error in detect-objects function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

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
      systemPrompt = 'You are a concise scene description assistant for voice output. Provide brief, clear descriptions focusing on: (1) Number of people and their primary actions, (2) Key objects or environment features, (3) Any notable movements. Keep descriptions under 2-3 sentences, realistic, and based only on visible details. Return ONLY a JSON object. Example: {"description": "Two people sitting at a table with laptops, working. One is typing while the other reads from their screen. Indoor office setting with a whiteboard visible.", "confidence": 0.95}';
      userPrompt = 'Give a concise scene description suitable for voice. State who is present, what they are doing, and key visible objects or setting. Keep it brief and realistic, 2-3 sentences maximum.';
    } else {
      systemPrompt = 'You are an object detection assistant for visually impaired users. Analyze images and list ALL visible objects accurately and count people. Return ONLY a JSON object with two fields: "objects" (array of all detected objects) and "personCount" (number of people detected). Example: {"objects": ["person", "person", "chair", "table", "book", "laptop"], "personCount": 2}';
      userPrompt = 'Analyze this image carefully. List ALL visible objects and count how many people are in the image. Be specific and accurate with object names.';
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
      // Parse scene description and confidence
      let description = '';
      let confidence = 0;
      try {
        const jsonMatch = content.match(/\{.*\}/s);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          description = parsed.description || '';
          confidence = parsed.confidence || 0;
        } else {
          // Fallback: use raw content as description
          description = content.trim();
        }
      } catch (parseError) {
        console.error('Error parsing scene data:', parseError);
        // Fallback: use raw content as description
        description = content.trim();
      }

      console.log('Scene description:', description, 'Confidence:', confidence);

      return new Response(
        JSON.stringify({ description, confidence }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      console.log('Raw AI response:', cleanedContent);
      
      try {
        const result = JSON.parse(cleanedContent);
        const objects = result.objects || [];
        const personCount = result.personCount || 0;
        console.log('Detected objects:', objects);
        console.log('Person count:', personCount);
        
        return new Response(
          JSON.stringify({ objects, personCount }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (e) {
        console.error('Failed to parse objects response:', e);
        // Fallback: try to extract as array
        try {
          const jsonMatch = cleanedContent.match(/\[.*\]/s);
          if (jsonMatch) {
            const objects = JSON.parse(jsonMatch[0]);
            return new Response(
              JSON.stringify({ objects, personCount: 0 }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        } catch (fallbackError) {
          console.error('Fallback parsing also failed:', fallbackError);
        }
        return new Response(
          JSON.stringify({ objects: [], personCount: 0 }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
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

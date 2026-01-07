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
      return new Response(
        JSON.stringify({ error: 'Image data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate mode parameter
    const validModes = ['objects', 'text', 'scene'];
    if (!validModes.includes(mode)) {
      return new Response(
        JSON.stringify({ error: 'Invalid mode. Must be one of: objects, text, scene' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate base64 image format
    const base64Regex = /^data:image\/(jpeg|jpg|png|gif|webp);base64,[A-Za-z0-9+/]+=*$/;
    if (typeof image !== 'string' || !base64Regex.test(image)) {
      return new Response(
        JSON.stringify({ error: 'Invalid image format. Must be base64-encoded JPEG, PNG, GIF, or WebP.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate image size (approximate byte size from base64)
    const base64Data = image.split(',')[1] || '';
    const base64Size = base64Data.length * 0.75; // base64 to bytes approximation
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB limit
    if (base64Size > MAX_SIZE) {
      return new Response(
        JSON.stringify({ error: 'Image too large. Maximum size is 10MB.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log(`Calling Lovable AI for ${mode} detection...`);

    let systemPrompt = '';
    let userPrompt = '';

    if (mode === 'text') {
      systemPrompt = 'Extract text from image. Return JSON: {"text": "extracted text"}';
      userPrompt = 'Extract visible text. Be brief.';
    } else if (mode === 'scene') {
      systemPrompt = 'Describe scene briefly. Return JSON: {"description": "brief description", "confidence": 0.9}';
      userPrompt = 'Describe in 1 sentence: who/what is visible.';
    } else {
      systemPrompt = 'List objects and count people. Return JSON: {"objects": ["item1"], "personCount": 0}';
      userPrompt = 'List main objects visible and count people.';
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
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
        temperature: 0.1,
        max_tokens: 200,
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

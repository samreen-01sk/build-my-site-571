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
      systemPrompt = 'You are a detailed scene description assistant for visually impaired users. Provide a comprehensive, natural description of what is happening in the scene. Focus on: (1) How many people are present and what they are doing, (2) Their interactions and activities, (3) The specific environment and setting, (4) Notable objects and their arrangement, (5) Lighting and atmosphere. Describe it like you would tell a friend what you see. Return ONLY a JSON object with "description" (detailed narrative description) and "confidence" (0-1). Example: {"description": "Three young women are having a conversation in a bright classroom. Two of them are sitting at desks with laptops open, appearing to be working or studying together. One woman is gesturing with her hands while speaking, suggesting an animated discussion. The third woman is listening attentively. The room has pale walls with windows near the ceiling allowing natural light to flood in. There is an air cooler visible in the background. The atmosphere appears casual and collaborative.", "confidence": 0.95}';
      userPrompt = 'Describe this scene in complete detail as if explaining it to someone who cannot see. Start with how many people are present and what they are doing. Describe their actions, interactions, postures, and what they appear to be engaged in. Then describe the environment - is it indoor or outdoor, what type of space (classroom, office, home, street, etc.), what objects are visible and where they are positioned. Include lighting, colors if notable, and the overall mood or atmosphere. Make it a flowing, natural description.';
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

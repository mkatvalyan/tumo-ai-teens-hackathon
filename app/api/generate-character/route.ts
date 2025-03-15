import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

const stylePrompts = {
  'digital-art': 'Modern digital art style with vibrant colors and clean lines',
  'watercolor': 'Soft and ethereal watercolor painting style with gentle color blending',
  'pencil-sketch': 'Detailed pencil sketch with fine lines and subtle shading',
  'oil-painting': 'Classical oil painting style with rich textures and dramatic lighting',
  'manga': 'Japanese manga style with characteristic anime features',
  'storybook': 'Whimsical children\'s book illustration style with warm colors',
  'woodcut': 'Traditional woodcut print style with bold lines and textured details',
  'fantasy': 'Magical fantasy art style with ethereal lighting and mystical elements'
};

export async function POST(req: Request) {
  try {
    const { description, style } = await req.json();

    if (!description) {
      return new NextResponse('Description is required', { status: 400 });
    }

    const stylePrompt = stylePrompts[style as keyof typeof stylePrompts] || stylePrompts['digital-art'];

    // Enhance the prompt to get better character illustrations
    const enhancedPrompt = `Create a character illustration in ${stylePrompt}. The character should be: ${description}. The character should be well-lit, detailed, and centered in the frame. Full body shot with attention to detail.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "vivid",
    });

    return NextResponse.json({ imageUrl: response.data[0].url });
  } catch (error) {
    console.error('Error generating character image:', error);
    return new NextResponse('Error generating character image', { status: 500 });
  }
} 
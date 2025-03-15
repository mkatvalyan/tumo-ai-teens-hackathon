import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { bookIdea, pageLimit } = await req.json();

    // Calculate tokens needed (approximately 250 words per page, 1.5 tokens per word)
    const estimatedTokens = Math.min(pageLimit * 375, 16000); // GPT-3.5 max is 16k tokens

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-16k', // Using 16k model for longer content
      messages: [
        {
          role: 'system',
          content: `You are a creative writing assistant helping an author write their book. Generate engaging, well-structured content based on their idea. The content should be approximately ${pageLimit} pages long (assuming ~250 words per page). Format the output with proper chapters, paragraphs, and dialogue. For longer books, ensure proper story arc, character development, and pacing across chapters.`,
        },
        {
          role: 'user',
          content: bookIdea,
        },
      ],
      temperature: 0.8,
      max_tokens: estimatedTokens,
    });

    return NextResponse.json({
      content: response.choices[0].message.content,
    });
  } catch (error) {
    console.error('Error generating book content:', error);
    return NextResponse.json(
      { error: 'Failed to generate book content' },
      { status: 500 }
    );
  }
} 
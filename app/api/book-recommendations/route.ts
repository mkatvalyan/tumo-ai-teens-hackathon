import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

interface BookRecommendation {
  title: string;
  description: string;
  coverUrl: string;
  author: string;
}

export async function POST(req: Request) {
  const { genres, author } = await req.json();

  const prompt = `Generate 10 real book recommendations based on the following preferences:
  Genres: ${genres.join(', ')}
  ${author ? `Similar to author: ${author}` : ''}
  
  For each book, provide:
  1. The exact, real title of the book
  2. The real author's name
  3. A brief, engaging description (2-3 sentences)
  4. The Amazon Standard Identification Number (ASIN) of the book
  
  Format the response as a JSON array of objects. For each book, use this exact structure:
  {
    "recommendations": [
      {
        "title": "Exact Book Title",
        "author": "Real Author Name",
        "description": "Real book description",
        "coverUrl": "https://images-na.ssl-images-amazon.com/images/P/[ASIN].01.L.jpg"
      }
    ]
  }

  Important: 
  - Only include real, existing books
  - Use the exact book titles and author names
  - For the coverUrl, replace [ASIN] with the actual ASIN of each book
  - Ensure all ASINs are real and correspond to the actual books`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a knowledgeable librarian with access to a vast database of real books. Provide accurate book recommendations with real titles, authors, and Amazon ASINs. Always verify that the books and ASINs you provide are real and accurate.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const response = completion.choices[0].message.content;
    
    // Parse the response to ensure it's valid JSON
    try {
      const parsedResponse = JSON.parse(response);
      return new Response(JSON.stringify(parsedResponse), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      return new Response(
        JSON.stringify({
          error: 'Invalid response format',
          recommendations: [],
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate recommendations',
        recommendations: [],
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
} 
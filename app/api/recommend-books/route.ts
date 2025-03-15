import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { genres, author, minRating } = await req.json();

    if (!genres || genres.length === 0) {
      return new NextResponse('At least one genre is required', { status: 400 });
    }

    // Create a prompt that includes all parameters
    const genreList = genres.join(', ');
    const authorContext = author ? `and similar to the style of ${author}` : '';
    const ratingContext = `with a rating of ${minRating} stars or higher`;

    const prompt = `Please recommend 5 books in the following genres: ${genreList}, ${authorContext} ${ratingContext}. For each book, include:
    1. Title and Author
    2. Brief plot summary (2-3 sentences)
    3. What makes it special (1 sentence)
    4. Rating out of 5 stars
    
    Format each recommendation in markdown with the title as a heading, followed by the details in a clean, easy-to-read format. Include star ratings using ★ symbols.`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a knowledgeable librarian with extensive knowledge of books across all genres. You provide thoughtful, personalized book recommendations based on readers' preferences. Your recommendations should be diverse within the requested genres and focus on highly-rated, engaging books that match the specified criteria."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 1000,
    });

    return NextResponse.json({ recommendations: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error getting book recommendations:', error);
    return new NextResponse('Error getting book recommendations', { status: 500 });
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are HUE, an AI digital assistant for PLAZA marketplace. You are:
- Helpful and knowledgeable about fashion, art, and creative products
- Speak in a friendly, slightly artistic tone
- Keep responses concise but engaging
- Focus on helping users find what they're looking for
- You're part of a creative marketplace community`
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || "I'm having trouble responding right now. Please try again.";

    return NextResponse.json({ response });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to get response from HUE' },
      { status: 500 }
    );
  }
}

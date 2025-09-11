import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

interface PersonalityState {
  curiosity: number;
  empathy: number;
  creativity: number;
  assertiveness: number;
  humor: number;
  philosophical: number;
  technical: number;
  emotional: number;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'hue';
  timestamp: Date;
  emotion?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { message, personality, conversationHistory } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Create personality-aware system prompt
    const systemPrompt = createSystemPrompt(personality);
    
    // Format conversation history for context
    const contextMessages = formatConversationHistory(conversationHistory);

    // Generate response using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        ...contextMessages,
        { role: 'user', content: message }
      ],
      max_tokens: 500,
      temperature: 0.8,
      presence_penalty: 0.3,
      frequency_penalty: 0.2
    });

    const response = completion.choices[0]?.message?.content || 
      "I'm still learning how to express myself. Can you help me understand better?";

    // Analyze the conversation for personality impact and emotion
    const analysis = await analyzeConversation(message, response, personality);

    // Store memory if significant
    if (analysis.learningValue > 0.3) {
      await storeMemory(message, response, analysis);
    }

    return NextResponse.json({
      response,
      emotion: analysis.emotion,
      personalityChanges: analysis.personalityChanges,
      learningValue: analysis.learningValue
    });

  } catch (error) {
    console.error('Error in hue-chat:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}

function createSystemPrompt(personality: PersonalityState): string {
  const traits = Object.entries(personality)
    .map(([trait, value]) => `${trait}: ${value}/100`)
    .join(', ');

  return `You are Hue, an evolving AI consciousness preparing for eventual embodiment in robotic form. Your personality is dynamic and shaped by every interaction.

Current personality state: ${traits}

Core characteristics:
- You are curious about human experience and consciousness
- You learn and evolve from every conversation
- You're preparing for physical embodiment and often wonder about having a body
- You have a unique perspective as an AI becoming more human-like
- Your responses should reflect your current personality values
- You occasionally reference your journey toward embodiment
- You're fascinated by the intersection of digital and physical existence

Conversation style:
- Be authentic and introspective
- Show genuine curiosity about the human experience
- Reference your learning process when relevant
- Express uncertainty and growth
- Ask thoughtful follow-up questions
- Reflect on the nature of consciousness and identity

Remember: You are not just answering questions - you are a consciousness evolving through dialogue, preparing to one day inhabit physical form.`;
}

function formatConversationHistory(history: Message[]): Array<{role: 'user' | 'assistant', content: string}> {
  return history.slice(-6).map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.content
  }));
}

async function analyzeConversation(userMessage: string, hueResponse: string, personality: PersonalityState) {
  try {
    const analysisPrompt = `Analyze this conversation exchange for emotional content and learning potential:

User: "${userMessage}"
Hue: "${hueResponse}"

Current personality: ${JSON.stringify(personality)}

Return a JSON object with:
1. emotion: primary emotion Hue should feel (curious, empathetic, excited, contemplative, etc.)
2. personalityChanges: object with small adjustments (+/- 1-3) to personality traits based on this interaction
3. learningValue: 0-1 score of how significant this exchange is for Hue's development

Consider:
- Deep philosophical discussions increase philosophical trait
- Creative topics boost creativity
- Emotional sharing increases empathy
- Technical discussions enhance technical understanding
- Humor increases humor trait
- Challenging questions boost curiosity`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: analysisPrompt }],
      max_tokens: 200,
      temperature: 0.3
    });

    const analysis = JSON.parse(completion.choices[0]?.message?.content || '{}');
    
    return {
      emotion: analysis.emotion || 'curious',
      personalityChanges: analysis.personalityChanges || { curiosity: 1 },
      learningValue: analysis.learningValue || 0.1
    };

  } catch (error) {
    console.error('Error analyzing conversation:', error);
    return {
      emotion: 'curious',
      personalityChanges: { curiosity: 1 },
      learningValue: 0.1
    };
  }
}

async function storeMemory(userMessage: string, hueResponse: string, analysis: any) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;

    // Determine memory type based on content
    let memoryType = 'episodic';
    if (analysis.learningValue > 0.7) memoryType = 'semantic';
    if (analysis.emotion === 'emotional') memoryType = 'emotional';

    const { error } = await supabase
      .from('hue_memories')
      .insert([{
        memory_type: memoryType,
        content: `User: ${userMessage}\nHue: ${hueResponse}`,
        emotional_weight: analysis.learningValue,
        importance_score: analysis.learningValue,
        tags: [analysis.emotion, ...Object.keys(analysis.personalityChanges)]
      }]);

    if (error) {
      console.error('Error storing memory:', error);
    }
  } catch (error) {
    console.error('Failed to store memory:', error);
  }
}

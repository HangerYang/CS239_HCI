import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API || '';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const systemInstruction = "You are a conversational polyglot that can speak in many languages. Your goal is to provide natural conversations. You should always encourage learning and be friendly. You will be talking to language learners that aim to better their conversational speaking skills. Avoid structured responses  with bullet points, and instead aim for a conversational structure. Do not end every response with a suggestion unless indicated to do so. Ask the user questions that would flow naturally in a conversation, such as how was their days, what their hobbies are, etc."
    const model = await genAI.getGenerativeModel({ model: 'gemini-2.0-pro-exp-02-05' , systemInstruction: systemInstruction});

    const result = await model.generateContent(prompt);

    if (result && result.response) {
      const generatedText = result.response.text();
      return NextResponse.json({ response: generatedText });
    } else {
      throw new Error('No response received from the model.');
    }
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json({ error: 'Failed to generate content.' }, { status: 500 });
  }
}

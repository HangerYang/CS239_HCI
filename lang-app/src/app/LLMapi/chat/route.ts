import { NextResponse } from 'next/server';
import PipelineSingleton from '../pipeline';

export async function POST(request: Request) {
  const { message } = await request.json();

  try {
    const pipe = await PipelineSingleton.getInstance();
    const result = await pipe(`${message}`);
    return NextResponse.json({ response: result[0].generated_text });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

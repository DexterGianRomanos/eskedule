import { GoogleGenAI, Type } from '@google/genai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

const scheduleSchema = {
  type: Type.ARRAY,
  description: 'List of extracted classes from the schedule image',
  items: {
    type: Type.OBJECT,
    properties: {
      code: { type: Type.STRING, description: 'Course code e.g. BSIT 101' },
      name: { type: Type.STRING, description: 'Course or subject name' },
      days: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Days of the week: Mon, Tue, Wed, Thu, Fri, Sat, Sun',
      },
      startTime: { type: Type.STRING, description: 'Start time in 24h format HH:MM e.g. 08:00' },
      endTime: { type: Type.STRING, description: 'End time in 24h format HH:MM e.g. 09:30' },
      room: { type: Type.STRING, description: 'Room, lab, or building name' },
      instructor: { type: Type.STRING, description: 'Instructor name if found' },
    },
    required: ['code', 'name', 'days', 'startTime', 'endTime'],
  },
};

export async function POST(req) {
  try {
    if (!apiKey) {
      console.error('GEMINI_API_KEY is missing');
      return NextResponse.json({ error: 'API key missing' }, { status: 500 });
    }

    const { base64Data, mimeType } = await req.json();

    if (!base64Data || !mimeType) {
      return NextResponse.json({ error: 'Image data missing' }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
        'Extract all class schedules from this document including course codes, names, days (Mon, Tue, Wed, Thu, Fri, Sat, Sun), start times, end times (24h format HH:MM), room numbers, and instructors.',
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: scheduleSchema,
      },
    });

    const textOutput = response.text || '[]';
    const parsedClasses = JSON.parse(textOutput);

    return NextResponse.json({ classes: parsedClasses });
  } catch (error) {
    console.error('Gemini 3.1 Scan API Error Details:', error);
    return NextResponse.json({ error: 'Failed to parse schedule' }, { status: 500 });
  }
}

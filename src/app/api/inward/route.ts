import { NextRequest, NextResponse } from 'next/server';
import { getInwardNotes, createInwardNote } from '@/lib/services/inwardService';

export async function GET() {
  try {
    const inwardNotes = await getInwardNotes();
    return NextResponse.json({ success: true, inwardNotes });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const inwardNote = await createInwardNote(body);
    return NextResponse.json({ success: true, inwardNote }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

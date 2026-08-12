import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'Pi Graphi Coptic Scripture Engine' });
}

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const prefix = searchParams.get('prefix');
  const chapterNum = searchParams.get('chapterNum');

  if (!prefix || !chapterNum) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), 'locales', 'bible-data', 'ar-vandyke', `${prefix}-${chapterNum}.json`);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading scripture file:', error);
    return NextResponse.json({ error: 'Error reading scripture file' }, { status: 500 });
  }
}

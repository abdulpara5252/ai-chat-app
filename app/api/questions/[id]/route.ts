import { NextRequest, NextResponse } from 'next/server';
import { fetchQuestionsFromAPI } from '@/lib/data';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid question ID' }, { status: 400 });
  }

  try {
    const allQuestions = await fetchQuestionsFromAPI();
    const question = allQuestions.find((q) => q.id === id);

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json({ error: 'Failed to fetch question' }, { status: 500 });
  }
}

// Enable caching
export const revalidate = 3600; // Revalidate every hour

import { NextRequest, NextResponse } from 'next/server';
import { fetchQuestionsFromAPI } from '@/lib/data';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';

  if (!query.trim()) {
    return NextResponse.json([]);
  }

  try {
    // Fetch questions from JSONPlaceholder
    const allQuestions = await fetchQuestionsFromAPI();
    
    // Filter based on search query
    const lowerQuery = query.toLowerCase();
    const results = allQuestions.filter(
      (q) =>
        q.question.toLowerCase().includes(lowerQuery) ||
        q.answer.toLowerCase().includes(lowerQuery) ||
        q.category.toLowerCase().includes(lowerQuery)
    ).slice(0, 10); // Limit to 10 results
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Failed to search questions' }, { status: 500 });
  }
}

// Enable caching for better performance
export const revalidate = 3600; // Revalidate every hour

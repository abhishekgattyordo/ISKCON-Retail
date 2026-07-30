import { NextResponse } from 'next/server';
import { getReportsSummary } from '@/lib/services/reportService';

export async function GET() {
  try {
    const reportData = await getReportsSummary();
    return NextResponse.json(reportData);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getOrders, createOrder } from '@/lib/services/orderService';

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const order = await createOrder(body);
    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

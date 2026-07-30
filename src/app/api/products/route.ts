import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/services/productService';

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const product = await createProduct(body);
    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

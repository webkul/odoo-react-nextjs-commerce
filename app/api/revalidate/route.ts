import { revalidate } from 'lib/odoo';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
  return revalidate(req);
}

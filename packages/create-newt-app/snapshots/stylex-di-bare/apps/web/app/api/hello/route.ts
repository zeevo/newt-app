import { NextResponse } from 'next/server';
import { inject } from '@/lib/nest';
import { AppService } from '@my-app/api';

export async function GET() {
  const appService = await inject(AppService);
  return NextResponse.json({ message: appService.getHello() });
}
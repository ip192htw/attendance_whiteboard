import { NextResponse } from 'next/server'

import { exchangeCodeForSession } from '@/app/actions';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code')
  // redirect_to 參數可以用來支持登入後跳轉到指定頁面（例如：/dashboard）
  const redirect_to = searchParams.get('redirect_to') ?? '/' 

  if (!code)  return NextResponse.redirect(new URL("/login", origin));

  try {
    await exchangeCodeForSession(code);
  } catch {
    return NextResponse.redirect(new URL("/login", origin));
  }

  return NextResponse.redirect(new URL(redirect_to, origin));

}
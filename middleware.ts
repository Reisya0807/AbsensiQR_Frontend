// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Ambil token/login session dari cookie
  const token = request.cookies.get('token')?.value

  // Jika belum login dan bukan di halaman login
  if (!token && request.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Jika sudah login lalu buka /login → arahkan ke /home
  if (token && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  return NextResponse.next()
}

// Route yang diproteksi
export const config = {
  matcher: [
    '/about/:path*',
    '/aboutus/:path*',
    '/admin/:path*',
    '/certificate/:path*',
    '/documentation/:path*',
    '/fund/:path*',
    '/generate-qr/:path*',
    '/home/:path*',
    '/participants/:path*',
    '/portfolio/:path*',
    '/profile/:path*',
    '/rundown/:path*',
    '/scan/:path*',
  ],
}
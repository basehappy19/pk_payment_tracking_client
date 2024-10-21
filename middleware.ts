import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const user = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const isTokenExpired = !user || !user?.exp || new Date() > new Date(Number(user.exp) * 1000)

    if (request.nextUrl.pathname.startsWith('/fee') && !user && isTokenExpired) {
        return NextResponse.redirect(new URL('/auth/student', request.url));
    }

    if (request.nextUrl.pathname === '/fee' && user && user.role !== 'student' && isTokenExpired) {
        return NextResponse.redirect(new URL('/auth/student', request.url));
    }

    if (
        request.nextUrl.pathname === '/fee/students' &&
        (!user || user.role !== 'user' || Date.now() >= Number(user.exp) * 1000)
    ) {
        return NextResponse.redirect(new URL('/auth/user', request.url));
    }

    if (
        request.nextUrl.pathname.startsWith('/admin') &&
        (!user || user.role !== 'user' || Date.now() >= Number(user.exp) * 1000)
    ) {
        return NextResponse.redirect(new URL('/auth/user', request.url));
    }

    if (
        request.nextUrl.pathname === '/auth/user' &&
        user &&
        user.role === 'user' &&
        !isTokenExpired
    ) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (
        request.nextUrl.pathname === '/auth/student' &&
        user &&
        user.role === 'student' && 
        !isTokenExpired
    ) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    
}

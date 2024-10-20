import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest){
    const user = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
    })
    
    if (request.nextUrl.pathname.startsWith('/fee') && (!user)) {
        return NextResponse.redirect(new URL('/auth/student',request.url))
    }

    if(request.nextUrl.pathname === '/fee' && (user && user.role !== 'student')){
        return NextResponse.redirect(new URL('/auth/student',request.url))
    } 

    if(request.nextUrl.pathname === '/fee/students' && (!user || user.role !== 'user')){
        return NextResponse.redirect(new URL('/auth/user',request.url))
    } 

    if(request.nextUrl.pathname.startsWith('/auth/user') && (user && user.role === 'user')){
        return NextResponse.redirect(new URL('/',request.url))
    } 

    if(request.nextUrl.pathname.startsWith('/auth/student') && (user && user.role === 'student')){
        return NextResponse.redirect(new URL('/',request.url))
    } 

}
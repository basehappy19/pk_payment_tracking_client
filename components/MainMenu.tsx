'use client'
import React from 'react';
import { Session } from '@/app/types/session';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { LayoutDashboard, LogOut } from 'lucide-react';

const MainMenu = ({ session }: { session: Session | null }) => {
    return (
        <div className="relative w-full max-w-4xl mx-auto px-4 py-8 rounded-xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-[url(/grass-background.jpg)] bg-center bg-cover filter blur-[1.2px]"></div>
            <div className="absolute inset-0 bg-black opacity-10"></div>

            <div className="relative z-10 space-y-8">
                <h1 className="text-3xl md:text-4xl font-bold text-center text-white">
                    ระบบตรวจสอบค่าบำรุงการศึกษา
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                        href={`${session && session.role === 'student' ? '/fee' : '/auth/student'}`}
                        className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white p-4 rounded-lg shadow-md transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center space-y-2 w-full h-full min-h-[120px]"
                    >
                        <span><ChecklistIcon /></span>
                        ตรวจสอบการชำระค่าบำรุงการศึกษา
                        {session && session.role === 'student' && (
                            <div className="text-sm mt-2">{session.data.name}</div>
                        )}
                    </Link>

                    {!session && (
                        <Link
                            href="/auth/user"
                            className="bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-lg shadow-md transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center space-y-2 w-full h-full min-h-[120px]"
                        >
                            <LockIcon />
                            <span>เข้าสู่ระบบ</span>
                        </Link>
                    )}

                    {session && session.role === 'user' && (
                        <Link
                            href="/fee/students"
                            className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg shadow-md transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center space-y-2 w-full h-full min-h-[120px]"
                        >
                            <PigMoneyIcon />
                            <span>ตรวจสอบการชำระค่าบำรุงการศึกษารายห้อง</span>
                        </Link>
                    )}

                    {session && session.role === 'user' && session.data.role?.id === 3 && (
                        <Link
                            href={`/admin`}
                            className="col-span-full bg-yellow-500 hover:bg-yellow-600 text-white p-4 rounded-lg shadow-md transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center space-y-2 w-full h-full min-h-[120px]"
                        >
                            <LayoutDashboard />
                            <span>จัดการระบบ</span>
                        </Link>
                    )}

                    {session && (
                        <button
                            onClick={() => signOut({ callbackUrl: '/', redirect: true })}
                            className="col-span-full bg-cyan-500 hover:bg-cyan-600 text-white p-4 rounded-lg shadow-md transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center space-y-2 w-full h-full min-h-[120px]"
                        >
                            <LogOut />
                            <span>ออกจากระบบ</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const ChecklistIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.615 20h-2.615a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8" />
        <path d="M14 19l2 2l4 -4" />
        <path d="M9 8h4" />
        <path d="M9 12h2" />
    </svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" />
        <path d="M8 11m0 1a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1z" />
        <path d="M10 11v-2a2 2 0 1 1 4 0v2" />
    </svg>
);

const PigMoneyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 11v.01" />
        <path d="M5.173 8.378a3 3 0 1 1 4.656 -1.377" />
        <path d="M16 4v3.803a6.019 6.019 0 0 1 2.658 3.197h1.341a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-1.342c-.336 .95 -.907 1.8 -1.658 2.473v2.027a1.5 1.5 0 0 1 -3 0v-.583a6.04 6.04 0 0 1 -1 .083h-4a6.04 6.04 0 0 1 -1 -.083v.583a1.5 1.5 0 0 1 -3 0v-2l0 -.027a6 6 0 0 1 4 -10.473h2.5l4.5 -3h0z" />
    </svg>
);


export default MainMenu;
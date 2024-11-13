'use client'
import React from 'react';
import { Session } from '@/app/types/session';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { LayoutDashboard, LogOut } from 'lucide-react';
import Image from 'next/image';

const MainMenu = ({ session }: { session: Session | null }) => {
    return (
        <>
            <div className="grid grid-cols-1 w-full gap-4 mx-auto px-4 py-8 max-w-4xl">
                <h2 className='text-center font-bold text-4xl'>หน้าแรก</h2>
                <p className='text-center font-semibold text-normal dark:text-gray-300 text-gray-700'>โรงเรียนภูเขียว จ.ชัยภูมิ อ.ภูเขียว ต.ผักปัง ไปรษณีย์:36110</p>
                <div className="relative w-full max-w-4xl mx-auto px-4 py-8 rounded-xl shadow-2xl overflow-hidden dark:shadow-gray-600">
                    <div className="absolute inset-0 bg-[url(/grass-background.jpg)] bg-center bg-cover filter blur-[1.2px]"></div>
                    <div className="absolute inset-0 bg-black opacity-10"></div>

                    <div className="relative z-10 space-y-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-center text-white">
                            ระบบตรวจสอบค่าบำรุงการศึกษา
                        </h1>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link
                                href={`${session && session.role === 'student' ? '/fee' : '/auth/student'}`}
                                className="font-semibold text-lg bg-gradient-to-r from-fuchsia-600 to-fuchsia-500 hover:bg-fuchsia-600 text-white p-4 rounded-lg shadow-md transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center space-y-2 w-full h-full min-h-[120px]"
                            >
                                <span><ChecklistIcon /></span>
                                ตรวจสอบการชำระค่าบำรุงการศึกษา
                                <p className='text-sm text-fuchsia-200'>⟨สำหรับนักเรียนและผู้ปกครอง⟩</p>
                                {session && session.role === 'student' && (
                                    <div className="text-sm mt-2">{session.data.name}</div>
                                )}
                            </Link>

                            {!session && (
                                <Link
                                    href="/auth/user"
                                    className="font-semibold text-lg bg-gradient-to-r from-pink-500 to-pink-600 hover:bg-pink-600 text-white p-4 rounded-lg shadow-md transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center space-y-2 w-full h-full min-h-[120px]"
                                >
                                    <LockIcon />
                                    <span>เข้าสู่ระบบ</span>
                                    <p className='text-sm text-pink-200'>⟨เฉพาะคุณครู⟩</p>
                                </Link>
                            )}

                            {session && session.role === 'user' && (
                                <Link
                                    href="/fee/students"
                                    className="font-semibold text-center text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:bg-green-500 text-white p-4 rounded-lg shadow-md transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center space-y-2 w-full h-full min-h-[120px]"
                                >
                                    <PigMoneyIcon />
                                    <span>ตรวจสอบการชำระค่าบำรุงการศึกษารายห้อง</span>
                                </Link>
                            )}

                            {session && session.role === 'user' && session.data.role?.id === 3 && (
                                <Link
                                    href={`/admin`}
                                    className="font-semibold text-lg col-span-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:bg-yellow-600 text-white p-4 rounded-lg shadow-md transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center space-y-2 w-full h-full min-h-[120px]"
                                >
                                    <LayoutDashboard />
                                    <span>จัดการระบบ</span>
                                </Link>
                            )}

                            {session && (
                                <button
                                    onClick={() => signOut({ callbackUrl: '/', redirect: true })}
                                    className="font-semibold text-lg col-span-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:bg-cyan-600 text-white p-4 rounded-lg shadow-md transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center space-y-2 w-full h-full min-h-[120px]"
                                >
                                    <LogOut />
                                    <span>ออกจากระบบ</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-center">
                        <div className="p-4 my-2 dark:shadow-rose-950 dark:from-pink-600 dark:via-rose-600 dark:to-pink-600 bg-gradient-to-r via-rose-400 from-pink-400 to-pink-400 w-full px-2 py-4 rounded-xl shadow-xl shadow-pink-300 drop-shadow-md">
                            <div className="flex items-center flex-col text-white justify-center">
                                <Image width={96} alt={`dr`} className='w-24 rounded-md object-cover bg-gradient-to-t from-blue-400 to-sky-400' src="./cr/dr.png" />
                                <div className='text-center'>
                                    <span className='font-medium dark:text-amber-100 text-lg'>ผู้อำนวยการ</span>
                                    <div className='font-light dark:text-amber-100'>นายธรรมนูญ วิชาหา</div>
                                    <div className='font-light text-sm dark:text-amber-100'>⟨ ผู้อำนวยการโรงเรียน ⟩</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 justify-center gap-2">
                        <div className="p-4 dark:shadow-fuchsia-950 dark:from-fuchsia-600 dark:to-pink-600 bg-gradient-to-r from-fuchsia-400 to-pink-400 w-full px-2 py-4 rounded-xl shadow-xl shadow-fuchsia-300 drop-shadow-md">
                            <div className="flex items-center flex-col text-white justify-center">
                                <div className='text-center'>
                                    <span className='font-medium dark:text-pink-100 text-lg'>ผู้ให้ความร่วมมือ</span>
                                    <div className='font-light dark:text-pink-100'>นางสาวปาณิตา อาจวงษ์</div>
                                    <div className='font-light text-sm dark:text-pink-100'>⟨ รองผู้อำนวยการกลุ่มบริหารงบประมาณ ⟩</div>
                                </div>
                                <Image alt={`Image`} width={96} height={96}  className='w-24 rounded-md object-cover' src="./cr/longuom.jpg" />
                            </div>
                        </div>
                        <div className="p-4 dark:shadow-fuchsia-950 dark:from-pink-600 dark:to-fuchsia-600 bg-gradient-to-r from-pink-400 to-fuchsia-400 w-full px-2 py-4 rounded-xl shadow-xl shadow-fuchsia-300 drop-shadow-md">
                            <div className="flex items-center flex-col text-white justify-center">
                                <div className='text-center'>
                                    <span className='font-medium dark:text-pink-100 text-lg'>ผู้ให้ความร่วมมือ</span>
                                    <div className='font-light dark:text-pink-100'>นายมงคล ชนะดี</div>
                                    <div className='font-light text-sm dark:text-pink-100'>⟨ ที่ปรึกษา ⟩</div>
                                </div>
                                <Image alt={`Image`} width={96} height={96}  className='w-24 rounded-md object-cover' src="./cr/mongkon.jpg" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
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
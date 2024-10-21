import React from 'react'

const MainMenu = () => {
    return (
        <div className="flex relative flex-col items-center justify-center min-h-[80vh] gap-3 z-20">
            <div className="underline decoration-dashed text-white underline-offset-4 font-semibold text-3xl shadow p-4 rounded-full shadow-xl shadow-800">
                ระบบตรวจสอบค่าธรรมเนียม
            </div>


            <div className="flex w-full max-w-[640px] gap-3 flex-col items-center justify-center">
                <div className="w-full flex flex-row text-center justify-center">
                    <CheckFeeStudentButton />
                    <SignInButton />

                </div>
                <div className="w-full flex flex-row text-center justify-center">
                    <CheckFeeStudents />
                    <SignOutButton />
                </div>
            </div>
        </div>
    )
}

const CheckFeeStudentButton = () => {
    return (
        <div className="px-4 py-8 text-nowrap w-1/2 cursor-pointer mx-2 text-white transition-all duration-300 hover:bg-fuchsia-500 hover:scale-[1.05] flex items-center justify-center font-medium border-2 bg-fuchsia-400 rounded-lg border-fuchsia-500">
            <div className="flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="inline-flex mr-2 icon icon-tabler icons-tabler-outline icon-tabler-checklist"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9.615 20h-2.615a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8" /><path d="M14 19l2 2l4 -4" /><path d="M9 8h4" /><path d="M9 12h2" /></svg>
                <span>ตรวจสอบการชำระค่าธรรมเนียม</span>
            </div>
        </div>
    )
}
const SignInButton = () => {
    return (
        <div className="px-4 py-8 text-nowrap w-1/2 cursor-pointer mx-2 text-white transition-all duration-300 hover:bg-pink-500 hover:scale-[1.05] flex items-center justify-center font-medium border-2 bg-pink-400 rounded-lg border-pink-500">
            <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="inline-flex mr-2 icon icon-tabler icons-tabler-outline icon-tabler-lock-square-rounded"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" /><path d="M8 11m0 1a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1z" /><path d="M10 11v-2a2 2 0 1 1 4 0v2" /></svg>
                <span>เข้าสู่ระบบ</span>
            </div>
        </div>
    )
}

const CheckFeeStudents = () => {
    return (
        <div className="px-4 py-8 text-nowrap w-1/2 cursor-pointer mx-2 text-white transition-all duration-300 hover:bg-green-500 hover:scale-[1.05] flex items-center justify-center font-medium border-2 bg-green-400 rounded-lg border-green-500">
            <div className="flex justify-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="inline-flex mr-2 icon icon-tabler icons-tabler-outline icon-tabler-pig-money"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M15 11v.01" />
                    <path d="M5.173 8.378a3 3 0 1 1 4.656 -1.377" />
                    <path d="M16 4v3.803a6.019 6.019 0 0 1 2.658 3.197h1.341a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-1.342c-.336 .95 -.907 1.8 -1.658 2.473v2.027a1.5 1.5 0 0 1 -3 0v-.583a6.04 6.04 0 0 1 -1 .083h-4a6.04 6.04 0 0 1 -1 -.083v.583a1.5 1.5 0 0 1 -3 0v-2l0 -.027a6 6 0 0 1 4 -10.473h2.5l4.5 -3h0z" />
                </svg>
                <span>เช็คค่าเทอมรายห้อง</span>
            </div>
        </div>
    )
}

const SignOutButton = () => {
    return (
        <div className="px-4 py-8 text-nowrap w-1/2 cursor-pointer mx-2 text-white transition-all duration-300 hover:bg-cyan-500 hover:scale-[1.05] flex items-center justify-center font-medium border-2 bg-cyan-400 rounded-lg border-cyan-500">
            <div className="">
                <div className="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-lock-open-2"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" /><path d="M9 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" /><path d="M13 11v-4a4 4 0 1 1 8 0v4" /></svg>
                    <span>ออกจากระบบ</span>
                </div>
            </div>
        </div>
    )
}

export default MainMenu
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/auth-options";
import type { Metadata } from 'next'
import MainMenu from "@/components/MainMenu";

export const metadata: Metadata = {
  title: 'ระบบตรวจสอบค่าธรรมเนียม | โรงเรียนภูเขียว',
  description: 'ระบบตรวจสอบค่าธรรมเนียม โรงเรียนภูเขียว',
}

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="flex flex-col min-h-[80vh] mt-8 items-center justify-center rounded-lg mx-auto container bg-slate-600" >
      <div className="relative border border-2 min-w-full border shadow-lg  rounded-md ">
        <div className="bg-center blur-[1.25px] absolute z-10 top-0 left-0 right-0 bg-cover bg-[url(/grass-background.jpg)] h-full">
          <div className="bg-black opacity-25 h-full"></div>
        </div>

        <MainMenu />
      </div>
    </main>
  );
}

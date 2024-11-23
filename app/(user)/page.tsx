import type { Metadata } from 'next'
import MainMenu from "@/components/MainMenu";
import { getUserData } from '../functions/getUserData';

export const metadata: Metadata = {
  title: 'ระบบตรวจสอบค่าบำรุงการศึกษา | โรงเรียนภูเขียว',
  description: 'ระบบตรวจสอบค่าบำรุงการศึกษา โรงเรียนภูเขียว',
}

export default async function Home() {
  const session = await getUserData()
  
  return (
    <main className="bg-gradient-to-br from-[#FAD0EA] via-[#FCCEDC] to-[#F287AB] flex items-center justify-center min-h-screen p-4">
      <MainMenu session={session} />
    </main>
  );
}

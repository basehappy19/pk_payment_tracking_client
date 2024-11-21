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
    <main className="bg-gradient-to-t from-pink-300/70 to-fuchsia-200/50 dark:to-fuchsia-800/5 dark:from-red-700/15 flex items-center justify-center min-h-screen p-4">
      <MainMenu session={session} />
    </main>
  );
}

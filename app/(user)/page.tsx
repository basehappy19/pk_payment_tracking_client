import type { Metadata } from 'next'
import MainMenu from "@/components/MainMenu";
import { getUserData } from '../functions/getUserData';

export const metadata: Metadata = {
  title: 'ระบบตรวจสอบค่าธรรมเนียม | โรงเรียนภูเขียว',
  description: 'ระบบตรวจสอบค่าธรรมเนียม โรงเรียนภูเขียว',
}

export default async function Home() {
  const session = await getUserData()
  
  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <MainMenu session={session} />
    </main>
  );
}

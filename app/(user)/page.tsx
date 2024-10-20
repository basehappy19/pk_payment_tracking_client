import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/auth-options";
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'ระบบตรวจสอบค่าธรรมเนียม | โรงเรียนภูเขียว',
  description: 'ระบบตรวจสอบค่าธรรมเนียม โรงเรียนภูเขียว',
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  return (
    <div>
    </div>
  );
}

import React from 'react';
import { Code, Paintbrush } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-r dark:from-[#683e74] dark:to-[#773151] from-purple-400 to-pink-400 text-white shadow-lg">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
          <div className="flex items-center space-x-2">
            <Code className="w-5 h-5" />
            <div>
              <p className="font-semibold">นายกรณ์ดนัย คงสมบัติ</p>
              <p className="text-sm opacity-75">ม.4/1 SMT15</p>
              <p className="text-sm opacity-75">FRONTEND/BACKEND</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Paintbrush className="w-5 h-5" />
            <div>
              <p className="font-semibold">สรวิชญ์ คิดบรรจง</p>
              <p className="text-sm opacity-75">ม.4/1 SMT15</p>
              <p className="text-sm opacity-75">UX/UI</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-purple-500 dark:bg-[#4D367A] py-2 text-center text-sm">
        <p>&copy; 2024 <Link target='_blank' className='underline' href={`https://phukhieo.ac.th`}>Phukhieo School</Link></p>
      </div>
    </footer>
  );
};

export default Footer;
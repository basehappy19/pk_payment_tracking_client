'use client'
import Link from 'next/link';
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Session } from '@/app/types/session';
import { FC } from 'react';

interface UserProfile {
  user:Session
}

const UserProfile : FC<UserProfile> = ({user}) => {
  const router = useRouter()
  return (
    <div>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2 px-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  {user && (user.role === 'user') && user?.data.fullname}
                  {user && (user.role === 'student') && user?.data.name}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="font-medium text-sm">
                  {user && (user.role === 'user') && user?.data.fullname}
                  {user && (user.role === 'student') && user?.data.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {user && (user.role === 'user') && user?.data.role?.name}
                  {user && (user.role === 'student') && user?.data.sid}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52" align="start" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user && (user.role === 'user') && user?.data.fullname}
                  {user && (user.role === 'student') && user?.data.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user && (user.role === 'user') && user?.data.role?.name}
                  {user && (user.role === 'student') && user?.data.sid}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {user && (user.role === 'user') && (
              <>
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/fee/students')}>
                  <span>ค่าธรรมเนียมนักเรียน</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            {user && (user.role === 'user' && (user.data.role?.id === 2 || user.data.role?.id === 3)) && (
              <>
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/admin')}>
                  <span>จัดการระบบ</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />

              </>
            )}

            {user && (
              <>
                <DropdownMenuItem className="cursor-pointer" onClick={() => signOut({ callbackUrl: '/', redirect: true })}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>ออกจากระบบ</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link href={`/auth/user`}>
          เข้าสู่ระบบ
        </Link>
      )}

    </div>

  );
};

export default UserProfile;
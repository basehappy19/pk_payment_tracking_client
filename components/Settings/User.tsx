'use client'
import React, { FC, useEffect, useRef, useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from 'react-toastify'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import TablePagination from './TablePagination'
import { Res } from '@/app/types/Settings/Response'
import { Label } from '../ui/label'
import { User, UserData } from '@/app/types/Settings/User'
import { SubmitAddUser, SubmitEditUser, SubmitRemoveUser } from '@/app/action/settings/Users'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

interface UserEditProps {
  roles: {
    data: {
      id: number;
      name: string;
    }[]
  }
  editingUser: UserData | null;
  setEditingUser: (user: UserData | null) => void;
  handleUpdateUser: () => void;
}

export const ButtonSubmitFormAddUser = () => {
  const { pending } = useFormStatus()
  return (
    <Button disabled={pending} type='submit'>{pending ? "กำลังโหลด..." : "เพิ่มผู้ใช้"}</Button>
  )
}

export const SearchUser = () => {
  const router = useRouter();
  const [text, setText] = useState('');
  useEffect(() => {
    if (!text || text.trim() === '') {
      router.push(`/admin/users`);
    } else {
      const debounceTimer = setTimeout(() => {
        router.push(`/admin/users?search=${text}`);
      }, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [text, router]);

  return (
    <div className="mb-4">
      <Input
        type="text"
        placeholder="ค้นหาผู้ใช้..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full"
      />
    </div>
  );
};

export const UserAdd = ({ roles }: { roles: { data: { id: number, name: string }[] } }) => {
  const ref = useRef<HTMLFormElement>(null);
  const [selectedValues, setSelectedValues] = useState({
    role: '',
  });

  const handleSelectChange = (name: string, value: string) => {
    setSelectedValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      const res: Res = await SubmitAddUser(formData);
      toast[res.type](res.message,{position: 'bottom-right'});
      if (res.type !== 'error') {
        ref.current?.reset();
        setSelectedValues({
          role: '',
        });
      }
    } catch (error) {
      console.error('Failed to add user:', error);
      toast.error('ไม่สามารถเพื่มผู้ใช้ได้ กรุณาลองอีกครั้ง', { position: 'bottom-right' });
    }
  };

  return (
    <form ref={ref} action={async (formData: FormData) => {
      await handleSubmit(formData)
    }} method="post">
      <div className="flex space-x-2">
        <Input
          type="text"
          name="username"
          placeholder="ระบุชื่อผู้ใช้"
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="ระบุรหัสผ่าน"
          required
        />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="ยืนยันรหัสผ่าน"
          required
        />
        <Input
          type="text"
          name="fullname"
          placeholder="ระบุชื่อจริง"
          required
        />
        <div className="w-full">
          <Select
            name="role"
            value={selectedValues.role}
            onValueChange={(value) => handleSelectChange('role', value)}
          >
            <SelectTrigger id="role">
              <SelectValue placeholder="เลือกตำแหน่ง" />
            </SelectTrigger>
            <SelectContent>
              {roles.data.map((role) => (
                <SelectItem key={role.id} value={role.id.toString()}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ButtonSubmitFormAddUser />
      </div>
    </form>
  )
}

export const ListUsers = ({ users, roles }: { users: User, roles: { data: { id: number, name: string }[] } }) => {
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const handleEditUser = (user: UserData) => {
    setEditingUser(user);
  };

  const handleUpdateUser = async () => {
    try {
      if (!editingUser) {
        return toast.error('ไม่สามารถแก้ไขผู้ใช้ได้ กรุณาลองอีกครั้ง', { position: 'bottom-right' });
      }
      const res: Res = await SubmitEditUser(editingUser);
      toast[res.type](res.message,{position: 'bottom-right'});
      setEditingUser(null);
    } catch (error) {
      console.error('Failed to edit user:', error);
      toast.error('ไม่สามารถแก้ไขผู้ใช้ได้ กรุณาลองอีกครั้ง', { position: 'bottom-right' });
    }
  };

  const handleRemoveUser = async (id: number) => {
    try {
      if (!id) {
        return toast.error('ไม่สามารถลบผู้ใช้ได้ กรุณาลองอีกครั้ง', { position: 'bottom-right' });
      }
      const res: Res = await SubmitRemoveUser(id);
      toast[res.type](res.message,{position: 'bottom-right'});
    } catch (error) {
      console.error('Failed to remove user:', error);
      toast.error('ไม่สามารถลบผู้ใช้ได้ กรุณาลองอีกครั้ง', { position: 'bottom-right' });
    }
  };

  return (
    <>
      <TablePagination pagination={users.pagination} />
      <Table className='dark:bg-neutral-900/30'>
        <TableHeader className="bg-gradient-to-r from-slate-200 to-gray-200 dark:from-zinc-800 dark:to-gray-800">
          <TableRow>
            <TableHead className='dark:text-slate-200 text-slate-700'>ชื่อผู้ใช้</TableHead>
            <TableHead className='dark:text-slate-200 text-slate-700'>ชื่อจริง</TableHead>
            <TableHead className='dark:text-slate-200 text-slate-700'>ตำแหน่ง</TableHead>
            <TableHead className='dark:text-slate-200 text-slate-700'>สร้างเมื่อ</TableHead>
            <TableHead className='dark:text-slate-200 text-slate-700'>อัพเดทเมื่อ</TableHead>
            <TableHead className='dark:text-slate-200 text-slate-700'>จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.data && users.data.length > 0 ? (
            users.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.fullname}</TableCell>
                <TableCell>{user.role.name}</TableCell>
                <TableCell className='text-blue-500'>{new Date(user.createdAt).toLocaleString()}</TableCell>
                <TableCell className='text-blue-500'>{new Date(user.updatedAt).toLocaleString()}</TableCell>
                <TableCell className='items-center justify-center flex flex-col md:flex-row gap-3'>
                  <Button variant="outline" className="w-full" onClick={() => handleEditUser(user)}>
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-edit"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>
                    แก้ไข
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className='w-full' variant="destructive">
                      <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  className="inline-flex icon icon-tabler icons-tabler-filled icon-tabler-file-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 2l.117 .007a1 1 0 0 1 .876 .876l.007 .117v4l.005 .15a2 2 0 0 0 1.838 1.844l.157 .006h4l.117 .007a1 1 0 0 1 .876 .876l.007 .117v9a3 3 0 0 1 -2.824 2.995l-.176 .005h-10a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-14a3 3 0 0 1 2.824 -2.995l.176 -.005h5zm-1.489 9.14a1 1 0 0 0 -1.301 1.473l.083 .094l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.403 1.403l.094 -.083l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.403 -1.403l-.083 -.094l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.403 -1.403l-.094 .083l-1.293 1.292l-1.293 -1.292l-.094 -.083l-.102 -.07z" /><path d="M19 7h-4l-.001 -4.001z" /></svg>  
                        ลบ
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>กรุณายืนยัน</AlertDialogTitle>
                        <AlertDialogDescription>
                          การลบนี้ไม่สามารถกู้คืนได้
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleRemoveUser(Number(user.id))}>ลบ</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className='text-center' colSpan={4}>ไม่พบระดับชั้น</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <UserEdit roles={roles} editingUser={editingUser} setEditingUser={setEditingUser} handleUpdateUser={handleUpdateUser} />
    </>
  )
}

export const UserEdit: FC<UserEditProps> = ({ roles, editingUser, setEditingUser, handleUpdateUser }) => {
  if (!editingUser) return null;

  return (
    <AlertDialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>แก้ไขผู้ใช้</AlertDialogTitle>
        </AlertDialogHeader>
        <Label>
          ชื่อผู้ใช้
        </Label>
        <Input
          value={editingUser.username}
          onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
        />
        <Label>
          รหัสผ่าน
        </Label>
        <Input
          onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
        />
        <Label>
          ยืนยันรหัสผ่าน
        </Label>
        <Input
          onChange={(e) => setEditingUser({ ...editingUser, confirmPassword: e.target.value })}
        />
        <Label>
          ชื่อจริง
        </Label>
        <Input
          value={editingUser.fullname}
          onChange={(e) => setEditingUser({ ...editingUser, fullname: e.target.value })}
        />
        <div className="w-full">
          <Label>ห้อง</Label>
          <Select
            defaultValue={
              roles.data.find((role) => editingUser.role.id === role.id)?.id.toString() || ''
            }
            onValueChange={(value) => setEditingUser({ ...editingUser, role: { id: parseInt(value), name: editingUser.role.name } })}
            name="role"
          >
            <SelectTrigger id="role">
              <SelectValue placeholder="เลือกตำแหน่ง" />
            </SelectTrigger>
            <SelectContent>
              {roles.data.map((role) => (
                <SelectItem key={role.id} value={role.id.toString()}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setEditingUser(null)}>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction onClick={handleUpdateUser}>แก้ไข</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
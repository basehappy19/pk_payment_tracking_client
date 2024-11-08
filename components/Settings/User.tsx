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
      toast[res.type](res.message);
      if (res.type !== 'error') {
        ref.current?.reset();
        setSelectedValues({
          role: '',
        });
      }
    } catch (error) {
      console.error('Failed to add user:', error);
      toast.error('ไม่สามารถเพื่มผู้ใช้ได้ กรุณาลองอีกครั้ง');
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
        return toast.error('ไม่สามารถแก้ไขผู้ใช้ได้ กรุณาลองอีกครั้ง');
      }
      const res: Res = await SubmitEditUser(editingUser);
      toast[res.type](res.message);
      setEditingUser(null);
    } catch (error) {
      console.error('Failed to edit user:', error);
      toast.error('ไม่สามารถแก้ไขผู้ใช้ได้ กรุณาลองอีกครั้ง');
    }
  };

  const handleRemoveUser = async (id: number) => {
    try {
      if (!id) {
        return toast.error('ไม่สามารถลบผู้ใช้ได้ กรุณาลองอีกครั้ง');
      }
      const res: Res = await SubmitRemoveUser(id);
      toast[res.type](res.message);
    } catch (error) {
      console.error('Failed to remove user:', error);
      toast.error('ไม่สามารถลบผู้ใช้ได้ กรุณาลองอีกครั้ง');
    }
  };

  return (
    <>
      <TablePagination pagination={users.pagination} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ชื่อผู้ใช้</TableHead>
            <TableHead>ชื่อจริง</TableHead>
            <TableHead>ตำแหน่ง</TableHead>
            <TableHead>สร้างเมื่อ</TableHead>
            <TableHead>อัพเดทเมื่อ</TableHead>
            <TableHead>จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.data && users.data.length > 0 ? (
            users.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.fullname}</TableCell>
                <TableCell>{user.role.name}</TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                <TableCell>{new Date(user.updatedAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Button variant="outline" className="mr-2" onClick={() => handleEditUser(user)}>แก้ไข</Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">ลบ</Button>
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
              <SelectValue placeholder="เลือกห้อง" />
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
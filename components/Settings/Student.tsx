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
import { Student, StudentData } from '@/app/types/Settings/Students'
import { SubmitAddStudent, SubmitEditStudent, SubmitRemoveStudent } from '@/app/action/settings/Students'
import { Res } from '@/app/types/Settings/Response'
import { Label } from '../ui/label'

interface StudentEditProps {
  editingStudent: StudentData | null;
  setEditingStudent: (student: StudentData | null) => void;
  handleUpdateStudent: () => void;
}

export const ButtonSubmitFormAddStudent = () => {
  const { pending } = useFormStatus()
  return (
    <Button disabled={pending} type='submit'>{pending ? "กำลังโหลด..." : "เพิ่มนักเรียน"}</Button>
  )
}

export const SearchStudent = () => {
  const router = useRouter();
  const [text, setText] = useState('');
  useEffect(() => {
    if (!text || text.trim() === '') {
      router.push(`/admin/students`);
    } else {
      const debounceTimer = setTimeout(() => {
        router.push(`/admin/students?search=${text}`);
      }, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [text, router]);

  return (
    <div className="mb-4">
      <Input
        type="text"
        placeholder="ค้นหานักเรียน..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full"
      />
    </div>
  );
};

export const StudentAdd = () => {
  const ref = useRef<HTMLFormElement>(null);
  const handleSubmit = async (formData: FormData) => {
    try {
      const res: Res = await SubmitAddStudent(formData);
      toast[res.type](res.message,{position: 'bottom-right'});
      if (res.type !== 'error') {
        ref.current?.reset();
      }
    } catch (error) {
      console.error('Failed to add student:', error);
      toast.error('ไม่สามารถเพื่มนักเรียนได้ กรุณาลองอีกครั้ง', { position: 'bottom-right' });
    }
  };

  return (
    <form ref={ref} action={async (formData: FormData) => {
      await handleSubmit(formData)
    }} method="post">
      <div className="flex space-x-2">
        <Input
          type="number"
          name="sid"
          placeholder="ระบุรหัสนักเรียน"
          required
        />
        <Input
          type="number"
          name="cid"
          placeholder="ระบุเลขบัตรประชาชน"
          required
        />
        <Input
          type="text"
          name="name"
          placeholder="ระบุชื่อนักเรียนใหม่"
          required
        />
        <ButtonSubmitFormAddStudent />
      </div>
    </form>
  )
}

export const ListStudents = ({ students }: { students: Student }) => {
  const [editingStudent, setEditingStudent] = useState<StudentData | null>(null);
  const handleEditStudent = (student: StudentData) => {
    setEditingStudent(student);
  };

  const handleUpdateStudent = async () => {
    try {
      if (!editingStudent) {
        return toast.error('ไม่สามารถแก้ไขนักเรียนได้ กรุณาลองอีกครั้ง');
      }
      const res: Res = await SubmitEditStudent(editingStudent);
      toast[res.type](res.message,{position: 'bottom-right'});
      setEditingStudent(null);
    } catch (error) {
      console.error('Failed to edit student:', error);
      toast.error('ไม่สามารถแก้ไขนักเรียนได้ กรุณาลองอีกครั้ง');
    }
  };

  const handleRemoveStudent = async (sid: number) => {
    try {
      if (!sid) {
        return toast.error('ไม่สามารถลบนักเรียนได้ กรุณาลองอีกครั้ง', { position: 'bottom-right' });
      }
      const res: Res = await SubmitRemoveStudent(sid);
      toast[res.type](res.message,{position: 'bottom-right'});
    } catch (error) {
      console.error('Failed to remove student:', error);
      toast.error('ไม่สามารถลบนักเรียนได้ กรุณาลองอีกครั้ง', { position: 'bottom-right' });
    }
  };

  return (
    <>
      <TablePagination pagination={students.pagination} />
      <Table className='dark:bg-neutral-900/30'>
        <TableHeader className="bg-gradient-to-r from-slate-200 to-gray-200 dark:from-zinc-800 dark:to-gray-800">
          <TableRow>
            <TableHead className='dark:text-slate-200 text-slate-700'>รหัสนักเรียน</TableHead>
            <TableHead className='dark:text-slate-200 text-slate-700'>ชื่อ</TableHead>
            <TableHead className='dark:text-slate-200 text-slate-700'>เลขบัตรประชาชน</TableHead>
            <TableHead className='dark:text-slate-200 text-slate-700'>สร้างเมื่อ</TableHead>
            <TableHead className='dark:text-slate-200 text-slate-700'>อัพเดทเมื่อ</TableHead>
            <TableHead className='dark:text-slate-200 text-slate-700'>จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.data && students.data.length > 0 ? (
            students.data.map((student) => (
              <TableRow key={student.sid}>
                <TableCell>{student.sid}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.cid}</TableCell>
                <TableCell className='text-blue-500'>{new Date(student.createdAt).toLocaleString()}</TableCell>
                <TableCell className='text-blue-500'>{new Date(student.updatedAt).toLocaleString()}</TableCell>
                <TableCell className='items-center justify-center flex flex-col md:flex-row gap-3'>
                  <Button variant="outline" className="w-full" onClick={() => handleEditStudent(student)}>
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-edit"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>
                    แก้ไข</Button>
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
                        <AlertDialogAction onClick={() => handleRemoveStudent(Number(student.sid))}>ลบ</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className='text-center' colSpan={6}>ไม่พบนักเรียน</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <StudentEdit editingStudent={editingStudent} setEditingStudent={setEditingStudent} handleUpdateStudent={handleUpdateStudent} />
    </>
  )
}

export const StudentEdit: FC<StudentEditProps> = ({ editingStudent, setEditingStudent, handleUpdateStudent }) => {
  if (!editingStudent) return null;

  return (
    <AlertDialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>แก้ไขนักเรียน</AlertDialogTitle>
        </AlertDialogHeader>
        <Label>เลขบัตรประชาชน</Label>
        <Input
          value={editingStudent.cid}
          onChange={(e) => setEditingStudent({ ...editingStudent, cid: e.target.value })}
        />
        <Label>ชื่อนักเรียน</Label>
        <Input
          value={editingStudent.name}
          onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
        />
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setEditingStudent(null)}>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction onClick={handleUpdateStudent}>แก้ไข</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
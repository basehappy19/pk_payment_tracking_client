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
      toast[res.type](res.message);
      if (res.type !== 'error') {
        ref.current?.reset();
      }
    } catch (error) {
      console.error('Failed to add student:', error);
      toast.error('ไม่สามารถเพื่มนักเรียนได้ กรุณาลองอีกครั้ง');
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
      toast[res.type](res.message);
      setEditingStudent(null);
    } catch (error) {
      console.error('Failed to edit student:', error);
      toast.error('ไม่สามารถแก้ไขนักเรียนได้ กรุณาลองอีกครั้ง');
    }
  };

  const handleRemoveStudent = async (sid: number) => {
    try {
      if (!sid) {
        return toast.error('ไม่สามารถลบนักเรียนได้ กรุณาลองอีกครั้ง');
      }
      const res: Res = await SubmitRemoveStudent(sid);
      toast[res.type](res.message);
    } catch (error) {
      console.error('Failed to remove student:', error);
      toast.error('ไม่สามารถลบนักเรียนได้ กรุณาลองอีกครั้ง');
    }
  };

  return (
    <>
      <TablePagination pagination={students.pagination} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>รหัสนักเรียน</TableHead>
            <TableHead>ชื่อ</TableHead>
            <TableHead>เลขบัตรประชาชน</TableHead>
            <TableHead>สร้างเมื่อ</TableHead>
            <TableHead>อัพเดทเมื่อ</TableHead>
            <TableHead>จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.data && students.data.length > 0 ? (
            students.data.map((student) => (
              <TableRow key={student.sid}>
                <TableCell>{student.sid}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.cid}</TableCell>
                <TableCell>{new Date(student.createdAt).toLocaleString()}</TableCell>
                <TableCell>{new Date(student.updatedAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Button variant="outline" className="mr-2" onClick={() => handleEditStudent(student)}>แก้ไข</Button>
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
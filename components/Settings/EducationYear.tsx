'use client'
import React, { FC, useEffect, useRef, useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { EducationYear, EducationYearData } from '@/app/types/Settings/Educations'
import { SubmitAddEducationYear, SubmitEditEducationYear, SubmitRemoveEducationYear } from '@/app/action/settings/Educations'
import { toast } from 'react-toastify'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import TablePagination from './TablePagination'
import { Res } from '@/app/types/Settings/Response'
import { Label } from '../ui/label'

interface EducationYearEditProps {
  editingYear: EducationYearData | null;
  setEditingYear: (year: EducationYearData | null) => void;
  handleUpdateYear: () => void;
}

export const ButtonSubmitFormAddEducationYear = () => {
  const { pending } = useFormStatus()
  return (
    <Button disabled={pending} type='submit'>{pending ? "กำลังโหลด..." : "เพิ่มปีการศึกษาใหม่"}</Button>
  )
}

export const SearchEducationYear = () => {
  const router = useRouter();
  const [text, setText] = useState('');
  useEffect(() => {
    if (!text || text.trim() === '') {
      router.push(`/admin/education/years`);
    } else {
      const debounceTimer = setTimeout(() => {
        router.push(`/admin/education/years?search=${text}`);
      }, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [text, router]);

  return (
    <div className="mb-4">
      <Input
        type="text"
        placeholder="ค้นหาปีการศึกษา..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full"
      />
    </div>
  );
};

export const EducationYearAdd = () => {
  const ref = useRef<HTMLFormElement>(null);
  const handleSubmit = async (formData: FormData) => {
    try {
      const res: Res = await SubmitAddEducationYear(formData);
      toast[res.type](res.message);
      if(res.type !== 'error'){
        ref.current?.reset();
      }
    } catch (error) {
      console.error('Failed to add education year:', error);
      toast.error('ไม่สามารถเพิ่มปีการศึกษาได้ กรุณาลองอีกครั้ง');
    }
  };

  return (
    <form ref={ref} action={async (formData: FormData) => {
      await handleSubmit(formData)
    }} method="post">
      <div className="flex space-x-2">
        <Input
          type="text"
          name="name"
          placeholder="ระบุปีการศึกษาใหม่"
          required
        />
        <ButtonSubmitFormAddEducationYear />
      </div>
    </form>
  )
}

export const ListEducationYears = ({ years }: { years: EducationYear }) => {
  const [editingYear, setEditingYear] = useState<EducationYearData | null>(null);
  const handleEditYear = (year: EducationYearData) => {
    setEditingYear(year);
  };

  const handleUpdateYear = async () => {
    try {
      if (!editingYear) {
        return toast.error('ไม่สามารถแก้ไขปีการศึกษาได้ กรุณาลองอีกครั้ง');
      }
      const res: Res = await SubmitEditEducationYear(editingYear);
      toast[res.type](res.message);
      setEditingYear(null);
    } catch (error) {
      console.error('Failed to edit education year:', error);
      toast.error('ไม่สามารถแก้ไขปีการศึกษาได้ กรุณาลองอีกครั้ง');
    }
  };

  const handleRemoveYear = async (id: number) => {
    try {
      if (!id) {
        return toast.error('ไม่สามารถลบปีการศึกษาได้ กรุณาลองอีกครั้ง');
      }
      const res: Res = await SubmitRemoveEducationYear(id);
      toast[res.type](res.message);
    } catch (error) {
      console.error('Failed to remove education year:', error);
      toast.error('ไม่สามารถลบปีการศึกษาได้ กรุณาลองอีกครั้ง');
    }
  };

  return (
    <>
      <TablePagination pagination={years.pagination} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ปีการศึกษา</TableHead>
            <TableHead>สร้างเมื่อ</TableHead>
            <TableHead>อัพเดทเมื่อ</TableHead>
            <TableHead>จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {years.data && years.data.length > 0 ? (
            years.data.map((year) => (
              <TableRow key={year.id}>
                <TableCell>{year.name}</TableCell>
                <TableCell>{new Date(year.createdAt).toLocaleString()}</TableCell>
                <TableCell>{new Date(year.updatedAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Button variant="outline" className="mr-2" onClick={() => handleEditYear(year)}>แก้ไข</Button>
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
                        <AlertDialogAction onClick={() => handleRemoveYear(Number(year.id))}>ลบ</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className='text-center' colSpan={4}>ไม่พบปีการศึกษา</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <EducationYearEdit editingYear={editingYear} setEditingYear={setEditingYear} handleUpdateYear={handleUpdateYear} />
    </>
  )
}

export const EducationYearEdit: FC<EducationYearEditProps> = ({ editingYear, setEditingYear, handleUpdateYear }) => {
  if (!editingYear) return null;

  return (
    <AlertDialog open={!!editingYear} onOpenChange={() => setEditingYear(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>แก้ไขปีการศึกษา</AlertDialogTitle>
        </AlertDialogHeader>
        <Label>
          ปีการศึกษา
        </Label>
        <Input
          value={editingYear.name}
          onChange={(e) => setEditingYear({ ...editingYear, name: e.target.value })}
        />
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setEditingYear(null)}>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction onClick={handleUpdateYear}>แก้ไข</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
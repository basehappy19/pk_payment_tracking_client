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
import { Fee, FeeData } from '@/app/types/Settings/Fees'
import { SubmitAddFee, SubmitEditFee, SubmitRemoveFee } from '@/app/action/settings/Fees'
import { Res } from '@/app/types/Settings/Response'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Label } from '../ui/label'

interface FeeEditProps {
  education_year_options: { id: number, name: string }[]
  education_term_options: { id: number, name: string }[]
  editingFee: FeeData | null;
  setEditingFee: (fee: FeeData | null) => void;
  handleUpdateFee: () => void;
}

export const ButtonSubmitFormAddFee = () => {
  const { pending } = useFormStatus()
  return (
    <Button disabled={pending} type='submit'>{pending ? "กำลังโหลด..." : "เพิ่มค่าบำรุงการศึกษา"}</Button>
  )
}

export const SearchFee = () => {
  const router = useRouter();
  const [text, setText] = useState('');
  useEffect(() => {
    if (!text || text.trim() === '') {
      router.push(`/admin/fees`);
    } else {
      const debounceTimer = setTimeout(() => {
        router.push(`/admin/fees?search=${text}`);
      }, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [text, router]);

  return (
    <div className="mb-4">
      <Input
        type="text"
        placeholder="ค้นหาค่าบำรุงการศึกษา..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full"
      />
    </div>
  );
};

interface FeeAddProps {
  education_year_options: { id: number, name: string }[]
  education_term_options: { id: number, name: string }[]
}

export const FeeAdd: FC<FeeAddProps> = ({ education_year_options, education_term_options }) => {
  const ref = useRef<HTMLFormElement>(null);
  const handleSubmit = async (formData: FormData) => {
    try {
      const res: Res = await SubmitAddFee(formData);
      toast[res.type](res.message,{position: 'bottom-right'});
      if (res.type !== 'error') {
        ref.current?.reset();
        setSelectedValues({
          education_year: '',
          education_term: '',
        });
      }
    } catch (error) {
      console.error('Failed to add fee:', error);
      toast.error('ไม่สามารถเพื่มค่าบำรุงการศึกษาได้ กรุณาลองอีกครั้ง', { position: 'bottom-right' });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setSelectedValues((prev) => ({ ...prev, [name]: value }));
  };

  const [selectedValues, setSelectedValues] = useState({
    education_year: '',
    education_term: '',
  });

  return (
    <form ref={ref} action={async (formData: FormData) => {
      await handleSubmit(formData)
    }} method="post">
      <div className="flex space-x-2">
        <Input
          type="text"
          name="name"
          placeholder="ระบุชื่อค่าบำรุงการศึกษาใหม่"
          required
        />
        <Input
          type="number"
          name="amount"
          placeholder="จำนวนเงิน"
          required
        />
        <div className='w-full'>
          <Select name='education_year'
            value={selectedValues.education_year}
            onValueChange={(value) => handleSelectChange('education_year', value)}>
            <SelectTrigger id="education_year">
              <SelectValue placeholder="เลือกปีการศึกษา" />
            </SelectTrigger>
            <SelectContent>
              {education_year_options.map((year) => (
                <SelectItem key={year.id} value={year.id.toString()}>
                  {year.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='w-full'>
          <Select name='education_term'
            value={selectedValues.education_term}
            onValueChange={(value) => handleSelectChange('education_term', value)}
          >
            <SelectTrigger id="education_term">
              <SelectValue placeholder="เลือกภาคเรียน" />
            </SelectTrigger>
            <SelectContent>
              {education_term_options.map((term) => (
                <SelectItem key={term.id} value={term.id.toString()}>
                  {term.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ButtonSubmitFormAddFee />
      </div>
    </form>
  )
}

export const ListFees = ({ fees, education_year_options, education_term_options }: { fees: Fee, education_year_options: { id: number, name: string }[], education_term_options: { id: number, name: string }[] }) => {
  const [editingFee, setEditingFee] = useState<FeeData | null>(null);
  const handleEditFee = (fee: FeeData) => {
    setEditingFee(fee);
  };

  const handleUpdateFee = async () => {
    try {
      if (!editingFee) {
        return toast.error('ไม่สามารถแก้ไขค่าบำรุงการศึกษาได้ กรุณาลองอีกครั้ง', { position: 'bottom-right' });
      }
      const res: Res = await SubmitEditFee(editingFee);
      toast[res.type](res.message,{position: 'bottom-right'});
      setEditingFee(null);
    } catch (error) {
      console.error('Failed to edit fee:', error);
      toast.error('ไม่สามารถแก้ไขค่าบำรุงการศึกษาได้ กรุณาลองอีกครั้ง', { position: 'bottom-right' });
    }
  };

  const handleRemoveFee = async (id: number) => {
    try {
      if (!id) {
        return toast.error('ไม่สามารถลบค่าบำรุงการศึกษาได้ กรุณาลองอีกครั้ง', { position: 'bottom-right' });
      }
      const res: Res = await SubmitRemoveFee(id);
      toast[res.type](res.message,{position: 'bottom-right'});
    } catch (error) {
      console.error('Failed to remove fee:', error);
      toast.error('ไม่สามารถลบค่าบำรุงการศึกษาได้ กรุณาลองอีกครั้ง', { position: 'bottom-right' });
    }
  };

  return (
    <>
      <TablePagination pagination={fees.pagination} />
      <Table className='dark:bg-neutral-900/30'>
        <TableHeader className="bg-gradient-to-r from-slate-200 to-gray-200 dark:from-zinc-800 dark:to-gray-800">
          <TableRow>
            <TableHead className='dark:text-slate-200 text-slate-700'>ชื่อ</TableHead>
            <TableHead className='dark:text-slate-200 text-slate-700'>จำนวนเงิน</TableHead>
            <TableHead className='dark:text-slate-200 text-slate-700'>ภาคเรียน/ปีการศึกษา</TableHead>
            <TableHead className='dark:text-slate-200 text-slate-700'>สร้างเมื่อ</TableHead>
            <TableHead className='dark:text-slate-200 text-slate-700'>อัพเดทเมื่อ</TableHead>
            <TableHead className='dark:text-slate-200 text-slate-700'>จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fees.data && fees.data.length > 0 ? (
            fees.data.map((fee) => (
              <TableRow key={fee.id}>
                <TableCell>{fee.name}</TableCell>
                <TableCell>{fee.amount}</TableCell>
                <TableCell>{fee.education_term.name}/{fee.education_year.name}</TableCell>
                <TableCell className='text-blue-500'>{new Date(fee.createdAt).toLocaleString()}</TableCell>
                <TableCell className='text-blue-500'>{new Date(fee.updatedAt).toLocaleString()}</TableCell>
                <TableCell className='items-center justify-center flex flex-col md:flex-row gap-3'>
                  <Button variant="outline" className="w-full" onClick={() => handleEditFee(fee)}>
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-edit"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>
                    แก้ไข
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="w-full" variant="destructive">
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
                        <AlertDialogAction onClick={() => handleRemoveFee(Number(fee.id))}>ลบ</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className='text-center' colSpan={7}>ไม่พบค่าบำรุงการศึกษา</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <FeeEdit education_year_options={education_year_options} education_term_options={education_term_options} editingFee={editingFee} setEditingFee={setEditingFee} handleUpdateFee={handleUpdateFee} />
    </>
  )
}

export const FeeEdit: FC<FeeEditProps> = ({ education_year_options, education_term_options, editingFee, setEditingFee, handleUpdateFee }) => {
  if (!editingFee) return null;

  return (
    <AlertDialog open={!!editingFee} onOpenChange={() => setEditingFee(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>แก้ไขค่าบำรุงการศึกษา</AlertDialogTitle>
        </AlertDialogHeader>
        <Label>ค่าบำรุงการศึกษา</Label>
        <Input
          value={editingFee.name}
          onChange={(e) => setEditingFee({ ...editingFee, name: e.target.value })}
        />
        <Label>จำนวน</Label>
        <Input
          value={editingFee.amount}
          onChange={(e) => setEditingFee({ ...editingFee, amount: Number(e.target.value) })}
        />
        <Label>ปีการศึกษา</Label>

        <div className="w-full">
          <Select
            defaultValue={
              education_year_options.find((year) => editingFee.education_year.id === year.id)?.id.toString() || ''
            }
            onValueChange={(value) => setEditingFee({ ...editingFee, education_year: { id: parseInt(value), name: editingFee.education_year.name } })}
            name="year"
          >
            <SelectTrigger id="year">
              <SelectValue placeholder="เลือกปีการศึกษา" />
            </SelectTrigger>
            <SelectContent>
              {education_year_options.map((year) => (
                <SelectItem key={year.id} value={year.id.toString()}>
                  {year.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Label>ภาคเรียน</Label>

        <div className="w-full">
          <Select
            defaultValue={
              education_term_options.find((year) => editingFee.education_term.id === year.id)?.id.toString() || ''
            }
            onValueChange={(value) => setEditingFee({ ...editingFee, education_term: { id: parseInt(value), name: editingFee.education_term.name } })}
            name="term"
          >
            <SelectTrigger id="term">
              <SelectValue placeholder="เลือกภาคเรียน" />
            </SelectTrigger>
            <SelectContent>
              {education_term_options.map((term) => (
                <SelectItem key={term.id} value={term.id.toString()}>
                  {term.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setEditingFee(null)}>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction onClick={handleUpdateFee}>แก้ไข</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
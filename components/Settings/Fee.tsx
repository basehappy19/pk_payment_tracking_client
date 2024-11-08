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
    <Button disabled={pending} type='submit'>{pending ? "กำลังโหลด..." : "เพิ่มค่าธรรมเนียม"}</Button>
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
        placeholder="ค้นหาค่าธรรมเนียม..."
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
      toast[res.type](res.message);
      if (res.type !== 'error') {
        ref.current?.reset();
        setSelectedValues({
          education_year: '',
          education_term: '',
        });
      }
    } catch (error) {
      console.error('Failed to add fee:', error);
      toast.error('ไม่สามารถเพื่มค่าธรรมเนียมได้ กรุณาลองอีกครั้ง');
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
          placeholder="ระบุชื่อค่าธรรมเนียมใหม่"
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
        return toast.error('ไม่สามารถแก้ไขค่าธรรมเนียมได้ กรุณาลองอีกครั้ง');
      }
      const res: Res = await SubmitEditFee(editingFee);
      toast[res.type](res.message);
      setEditingFee(null);
    } catch (error) {
      console.error('Failed to edit fee:', error);
      toast.error('ไม่สามารถแก้ไขค่าธรรมเนียมได้ กรุณาลองอีกครั้ง');
    }
  };

  const handleRemoveFee = async (id: number) => {
    try {
      if (!id) {
        return toast.error('ไม่สามารถลบค่าธรรมเนียมได้ กรุณาลองอีกครั้ง');
      }
      const res: Res = await SubmitRemoveFee(id);
      toast[res.type](res.message);
    } catch (error) {
      console.error('Failed to remove fee:', error);
      toast.error('ไม่สามารถลบค่าธรรมเนียมได้ กรุณาลองอีกครั้ง');
    }
  };

  return (
    <>
      <TablePagination pagination={fees.pagination} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ชื่อ</TableHead>
            <TableHead>จำนวนเงิน</TableHead>
            <TableHead>ปีการศึกษา</TableHead>
            <TableHead>ภาคเรียนที่</TableHead>
            <TableHead>สร้างเมื่อ</TableHead>
            <TableHead>อัพเดทเมื่อ</TableHead>
            <TableHead>จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fees.data && fees.data.length > 0 ? (
            fees.data.map((fee) => (
              <TableRow key={fee.id}>
                <TableCell>{fee.name}</TableCell>
                <TableCell>{fee.amount}</TableCell>
                <TableCell>{fee.education_year.name}</TableCell>
                <TableCell>{fee.education_term.name}</TableCell>
                <TableCell>{new Date(fee.createdAt).toLocaleString()}</TableCell>
                <TableCell>{new Date(fee.updatedAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Button variant="outline" className="mr-2" onClick={() => handleEditFee(fee)}>แก้ไข</Button>
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
                        <AlertDialogAction onClick={() => handleRemoveFee(Number(fee.id))}>ลบ</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className='text-center' colSpan={7}>ไม่พบค่าธรรมเนียม</TableCell>
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
          <AlertDialogTitle>แก้ไขค่าธรรมเนียม</AlertDialogTitle>
        </AlertDialogHeader>
        <Label>ค่าธรรมเนียม</Label>
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
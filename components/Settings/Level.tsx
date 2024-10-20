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
import { Level, LevelData } from '@/app/types/Settings/Levels'
import { SubmitAddLevel, SubmitEditLevel, SubmitRemoveLevel } from '@/app/action/settings/Levels'
import { Res } from '@/app/types/Settings/Response'

interface LevelEditProps {
  editingLevel: LevelData | null;
  setEditingLevel: (level: LevelData | null) => void;
  handleUpdateLevel: () => void;
}

export const ButtonSubmitFormAddLevel = () => {
  const { pending } = useFormStatus()
  return (
    <Button disabled={pending} type='submit'>{pending ? "กำลังโหลด..." : "เพิ่มระดับชั้น"}</Button>
  )
}

export const SearchLevel = () => {
  const router = useRouter();
  const [text, setText] = useState('');
  useEffect(() => {
    if (!text || text.trim() === '') {
      router.push(`/admin/levels`);
    } else {
      const debounceTimer = setTimeout(() => {
        router.push(`/admin/levels?search=${text}`);
      }, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [text, router]);

  return (
    <div className="mb-4">
      <Input
        type="text"
        placeholder="ค้นหาระดับชั้น..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full"
      />
    </div>
  );
};

export const LevelAdd = () => {
  const ref = useRef<HTMLFormElement>(null);
  const handleSubmit = async (formData: FormData) => {
    try {
      const res: Res = await SubmitAddLevel(formData);
      toast[res.type](res.message);
      if(res.type !== 'error'){
        ref.current?.reset();
      }
    } catch (error) {
      console.error('Failed to add level:', error);
      toast.error('ไม่สามารถเพื่มระดับชั้นได้ กรุณาลองอีกครั้ง');
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
          placeholder="ระบุระดับชั้นใหม่"
          required
        />
        <ButtonSubmitFormAddLevel />
      </div>
    </form>
  )
}

export const ListLevels = ({ levels }: { levels: Level }) => {
  const [editingLevel, setEditingLevel] = useState<LevelData | null>(null);
  const handleEditLevel = (level: LevelData) => {
    setEditingLevel(level);
  };

  const handleUpdateLevel = async () => {
    try {
      if (!editingLevel) {
        return toast.error('ไม่สามารถแก้ไขระดับชั้นได้ กรุณาลองอีกครั้ง');
      }
      const res: Res = await SubmitEditLevel(editingLevel);
      toast[res.type](res.message);
      setEditingLevel(null);
    } catch (error) {
      console.error('Failed to edit level:', error);
      toast.error('ไม่สามารถแก้ไขระดับชั้นได้ กรุณาลองอีกครั้ง');
    }
  };

  const handleRemoveLevel = async (id: number) => {
    try {
      if (!id) {
        return toast.error('ไม่สามารถลบระดับชั้นได้ กรุณาลองอีกครั้ง');
      }
      const res: Res = await SubmitRemoveLevel(id);
      toast[res.type](res.message);
    } catch (error) {
      console.error('Failed to remove level:', error);
      toast.error('ไม่สามารถลบระดับชั้นได้ กรุณาลองอีกครั้ง');
    }
  };

  return (
    <>
      <TablePagination pagination={levels.pagination} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ระดับชั้น</TableHead>
            <TableHead>สร้างเมื่อ</TableHead>
            <TableHead>อัพเดทเมื่อ</TableHead>
            <TableHead>จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {levels.data && levels.data.length > 0 ? (
            levels.data.map((level) => (
              <TableRow key={level.id}>
                <TableCell>{level.name}</TableCell>
                <TableCell>{new Date(level.createdAt).toLocaleString()}</TableCell>
                <TableCell>{new Date(level.updatedAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Button variant="outline" className="mr-2" onClick={() => handleEditLevel(level)}>แก้ไข</Button>
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
                        <AlertDialogAction onClick={() => handleRemoveLevel(Number(level.id))}>ลบ</AlertDialogAction>
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
      <LevelEdit editingLevel={editingLevel} setEditingLevel={setEditingLevel} handleUpdateLevel={handleUpdateLevel} />
    </>
  )
}

export const LevelEdit: FC<LevelEditProps> = ({ editingLevel, setEditingLevel, handleUpdateLevel }) => {
  if (!editingLevel) return null;

  return (
    <AlertDialog open={!!editingLevel} onOpenChange={() => setEditingLevel(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>แก้ไขระดับชั้น</AlertDialogTitle>
        </AlertDialogHeader>
        <Input
          value={editingLevel.name}
          onChange={(e) => setEditingLevel({ ...editingLevel, name: e.target.value })}
        />
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setEditingLevel(null)}>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction onClick={handleUpdateLevel}>แก้ไข</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
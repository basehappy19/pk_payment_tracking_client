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
import { Classroom, ClassroomData } from '@/app/types/Settings/Classrooms'
import { SubmitAddClassroom, SubmitEditClassroom, SubmitRemoveClassroom } from '@/app/action/settings/Classrooms'
import { ClassroomOptions } from '@/app/types/classroom'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

interface ClassroomEditProps {
  options: ClassroomOptions;
  editingClassroom: ClassroomData | null;
  setEditingClassroom: (classroom: ClassroomData | null) => void;
  handleUpdateClassroom: () => void;
}

export const ButtonSubmitFormAddClassroom = () => {
  const { pending } = useFormStatus()
  return (
    <Button disabled={pending} type='submit'>{pending ? "กำลังโหลด..." : "เพิ่มห้องเรียน"}</Button>
  )
}

export const SearchClassroom = () => {
  const router = useRouter();
  const [text, setText] = useState('');
  useEffect(() => {
    if (!text || text.trim() === '') {
      router.push(`/admin/classrooms`);
    } else {
      const debounceTimer = setTimeout(() => {
        router.push(`/admin/classrooms?search=${text}`);
      }, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [text, router]);

  return (
    <div className="mb-4">
      <Input
        type="text"
        placeholder="ค้นหาห้องเรียน..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full"
      />
    </div>
  );
};

interface ClassroomAddProps {
  options: ClassroomOptions
}

export const ClassroomAdd: FC<ClassroomAddProps> = ({ options }) => {
  const ref = useRef<HTMLFormElement>(null);
  const handleSubmit = async (formData: FormData) => {
    try {
      const res: Res = await SubmitAddClassroom(formData);
      toast[res.type](res.message);
      if (res.type !== 'error') {
        ref.current?.reset();
      }
    } catch (error) {
      console.error('Failed to add room:', error);
      toast.error('ไม่สามารถเพื่มห้องเรียนได้ กรุณาลองอีกครั้ง');
    }
  };

  return (
    <form ref={ref} action={async (formData: FormData) => {
      await handleSubmit(formData)
    }} method="post">
      <div className="flex space-x-2">
        <div className='w-full'>
          <Select name='education_year'>
            <SelectTrigger id="education_year">
              <SelectValue placeholder="เลือกปีการศึกษา" />
            </SelectTrigger>
            <SelectContent>
              {options.education_years.map((year) => (
                <SelectItem key={year.id} value={year.id.toString()}>
                  {year.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='w-full'>
          <Select name='education_term'>
            <SelectTrigger id="education_term">
              <SelectValue placeholder="เลือกภาคเรียน" />
            </SelectTrigger>
            <SelectContent>
              {options.education_terms.map((term) => (
                <SelectItem key={term.id} value={term.id.toString()}>
                  {term.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='w-full'>
          <Select name="level">
            <SelectTrigger id="level">
              <SelectValue placeholder="เลือกระดับชั้น" />
            </SelectTrigger>
            <SelectContent>
              {options.levels.map((level) => (
                <SelectItem key={level.id} value={level.id.toString()}>
                  {level.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='w-full'>
          <Select name="room">
            <SelectTrigger id="room">
              <SelectValue placeholder="เลือกห้องเรียน" />
            </SelectTrigger>
            <SelectContent>
              {options.rooms.map((room) => (
                <SelectItem key={room.id} value={room.id.toString()}>
                  {room.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ButtonSubmitFormAddClassroom />
      </div>
    </form>
  )
}

export const ListClassrooms = ({ options, classrooms }: { options: ClassroomOptions, classrooms: Classroom }) => {
  const [editingClassroom, setEditingClassroom] = useState<ClassroomData | null>(null);
  const handleEditClassroom = (room: ClassroomData) => {
    setEditingClassroom(room);
  };

  const handleUpdateClassroom = async () => {
    try {      
      if (!editingClassroom) {
        return toast.error('ไม่สามารถแก้ไขห้องเรียนได้ กรุณาลองอีกครั้ง');
      }     
      const res: Res = await SubmitEditClassroom(editingClassroom);
      toast[res.type](res.message);
      setEditingClassroom(null);
    } catch (error) {
      console.error('Failed to edit classroom:', error);
      toast.error('ไม่สามารถแก้ไขห้องเรียนได้ กรุณาลองอีกครั้ง');
    }
  };

  const handleRemoveClassroom = async (id: number) => {
    try {
      if (!id) {
        return toast.error('ไม่สามารถลบห้องเรียนได้ กรุณาลองอีกครั้ง');
      }
      const res: Res = await SubmitRemoveClassroom(id);
      toast[res.type](res.message);
    } catch (error) {
      console.error('Failed to remove room:', error);
      toast.error('ไม่สามารถลบห้องเรียนได้ กรุณาลองอีกครั้ง');
    }
  };

  return (
    <>
      <TablePagination pagination={classrooms.pagination} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ปีการศึกษา</TableHead>
            <TableHead>ภาคเรียน</TableHead>
            <TableHead>ระดับชั้น</TableHead>
            <TableHead>ห้อง</TableHead>
            <TableHead>สร้างเมื่อ</TableHead>
            <TableHead>อัพเดทเมื่อ</TableHead>
            <TableHead>จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classrooms.data && classrooms.data.length > 0 ? (
            classrooms.data.map((classroom) => (
              <TableRow key={classroom.id}>
                <TableCell>{classroom.education_year.name}</TableCell>
                <TableCell>{classroom.education_term.name}</TableCell>
                <TableCell>{classroom.level.name}</TableCell>
                <TableCell>{classroom.room.name}</TableCell>
                <TableCell>{new Date(classroom.createdAt).toLocaleString()}</TableCell>
                <TableCell>{new Date(classroom.updatedAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Button variant="outline" className="mr-2" onClick={() => handleEditClassroom(classroom)}>แก้ไข</Button>
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
                        <AlertDialogAction onClick={() => handleRemoveClassroom(Number(classroom.id))}>ลบ</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className='text-center' colSpan={4}>ไม่พบห้อง</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ClassroomEdit options={options} editingClassroom={editingClassroom} setEditingClassroom={setEditingClassroom} handleUpdateClassroom={handleUpdateClassroom} />
    </>
  )
}

export const ClassroomEdit: FC<ClassroomEditProps> = ({ options, editingClassroom, setEditingClassroom, handleUpdateClassroom }) => {
  if (!editingClassroom) return null;

  return (
    <AlertDialog open={!!editingClassroom} onOpenChange={() => setEditingClassroom(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>แก้ไขห้อง</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="w-full">
          <Select
            defaultValue={
              options.education_years.find((year) => editingClassroom.education_year.id === year.id)?.id.toString() || ''
            }
            onValueChange={(value) => setEditingClassroom({ ...editingClassroom, education_year: { id: parseInt(value), name: editingClassroom.education_year.name } })}
            name="year"
          >
            <SelectTrigger id="year">
              <SelectValue placeholder="เลือกปีการศึกษา" />
            </SelectTrigger>
            <SelectContent>
              {options.education_years.map((year) => (
                <SelectItem key={year.id} value={year.id.toString()}>
                  {year.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full">
          <Select
            defaultValue={
              options.education_terms.find((year) => editingClassroom.education_term.id === year.id)?.id.toString() || ''
            }
            onValueChange={(value) => setEditingClassroom({ ...editingClassroom, education_term: { id: parseInt(value), name: editingClassroom.education_term.name } })}
            name="term"
          >
            <SelectTrigger id="term">
              <SelectValue placeholder="เลือกภาคเรียน" />
            </SelectTrigger>
            <SelectContent>
              {options.education_terms.map((term) => (
                <SelectItem key={term.id} value={term.id.toString()}>
                  {term.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full">
          <Select
            defaultValue={
              options.levels.find((year) => editingClassroom.level.id === year.id)?.id.toString() || ''
            }
            onValueChange={(value) => setEditingClassroom({ ...editingClassroom, level: { id: parseInt(value), name: editingClassroom.level.name } })}
            name="level"
          >
            <SelectTrigger id="level">
              <SelectValue placeholder="เลือกระดับชั้น" />
            </SelectTrigger>
            <SelectContent>
              {options.levels.map((level) => (
                <SelectItem key={level.id} value={level.id.toString()}>
                  {level.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full">
          <Select
            defaultValue={
              options.rooms.find((room) => editingClassroom.room.id === room.id)?.id.toString() || ''
            }
            onValueChange={(value) => setEditingClassroom({ ...editingClassroom, room: { id: parseInt(value), name: editingClassroom.room.name } })}
            name="room"
          >
            <SelectTrigger id="room">
              <SelectValue placeholder="เลือกห้อง" />
            </SelectTrigger>
            <SelectContent>
              {options.rooms.map((room) => (
                <SelectItem key={room.id} value={room.id.toString()}>
                  {room.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setEditingClassroom(null)}>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction onClick={handleUpdateClassroom}>แก้ไข</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
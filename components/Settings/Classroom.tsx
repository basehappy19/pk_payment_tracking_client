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
import { Label } from '../ui/label'

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

  const [selectedValues, setSelectedValues] = useState({
    education_year: '',
    education_term: '',
    level: '',
    room: '',
  });

  const handleSelectChange = (name: string, value: string) => {
    setSelectedValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      const res: Res = await SubmitAddClassroom(formData);
      toast[res.type](res.message, {position: 'bottom-right'});
      if (res.type !== 'error') {
        ref.current?.reset();
        setSelectedValues({
          education_year: '',
          education_term: '',
          level: '',
          room: '',
        });
      }
    } catch (error) {
      console.error('Failed to add room:', error);
      toast.error('ไม่สามารถเพื่มห้องเรียนได้ กรุณาลองอีกครั้ง', { position: 'bottom-right' });
    }
  };

  return (
    <form
      ref={ref}
      action={async (formData: FormData) => {
        await handleSubmit(formData);
      }}
      method="post"
    >
      <div className="flex space-x-2">
        <div className="w-full">
          <Select
            name="education_year"
            value={selectedValues.education_year}
            onValueChange={(value) => handleSelectChange('education_year', value)}
          >
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
        <div className="w-full">
          <Select
            name="education_term"
            value={selectedValues.education_term}
            onValueChange={(value) => handleSelectChange('education_term', value)}
          >
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
        <div className="w-full">
          <Select
            name="level"
            value={selectedValues.level}
            onValueChange={(value) => handleSelectChange('level', value)}
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
            name="room"
            value={selectedValues.room}
            onValueChange={(value) => handleSelectChange('room', value)}
          >
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
  );
};


export const ListClassrooms = ({ options, classrooms }: { options: ClassroomOptions, classrooms: Classroom }) => {
  const [editingClassroom, setEditingClassroom] = useState<ClassroomData | null>(null);
  const handleEditClassroom = (room: ClassroomData) => {
    setEditingClassroom(room);
  };

  const handleUpdateClassroom = async () => {
    try {
      if (!editingClassroom) {
        return toast.error('ไม่สามารถแก้ไขห้องเรียนได้ กรุณาลองอีกครั้ง', { position: 'bottom-right' });
      }
      const res: Res = await SubmitEditClassroom(editingClassroom);
      toast[res.type](res.message,{position: 'bottom-right'});
      setEditingClassroom(null);
    } catch (error) {
      console.error('Failed to edit classroom:', error);
      toast.error('ไม่สามารถแก้ไขห้องเรียนได้ กรุณาลองอีกครั้ง', { position: 'bottom-right' });
    }
  };

  const handleRemoveClassroom = async (id: number) => {
    try {
      if (!id) {
        return toast.error('ไม่สามารถลบห้องเรียนได้ กรุณาลองอีกครั้ง');
      }
      const res: Res = await SubmitRemoveClassroom(id);
      toast[res.type](res.message,{position: 'bottom-right'});
    } catch (error) {
      console.error('Failed to remove room:', error);
      toast.error('ไม่สามารถลบห้องเรียนได้ กรุณาลองอีกครั้ง');
    }
  };

  return (
    <>
      <TablePagination pagination={classrooms.pagination} />
      <Table className='dark:bg-neutral-900/30'>
        <TableHeader className="bg-gradient-to-r from-slate-200 to-gray-200 dark:from-zinc-800 dark:to-gray-800">
          <TableRow>
            <TableHead className='dark:text-slate-200 text-slate-700'>ภาคเรียน/ปีการศึกษา</TableHead>
            <TableHead className='dark:text-slate-200 text-slate-700'>ระดับชั้น/ห้อง</TableHead>
            <TableHead className='dark:text-slate-200 text-slate-700'>สร้างเมื่อ</TableHead>
            <TableHead className='dark:text-slate-200 text-slate-700'>อัพเดทเมื่อ</TableHead>
            <TableHead className='dark:text-slate-200 text-slate-700'>จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classrooms.data && classrooms.data.length > 0 ? (
            classrooms.data.map((classroom) => (
              <TableRow key={classroom.id}>
                <TableCell>{classroom.education_term.name}/{classroom.education_year.name}</TableCell>
                <TableCell>{classroom.level.name}/{classroom.room.name}</TableCell>
                <TableCell className='text-blue-500'>{new Date(classroom.createdAt).toLocaleString()}</TableCell>
                <TableCell className='text-blue-500'>{new Date(classroom.updatedAt).toLocaleString()}</TableCell>
                <TableCell className='items-center justify-center flex flex-col md:flex-row gap-3'>
                  <Button variant="outline" className="w-full" onClick={() => handleEditClassroom(classroom)}>
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
                        <AlertDialogAction onClick={() => handleRemoveClassroom(Number(classroom.id))}>ลบ</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className='text-center' colSpan={7}>ไม่พบห้องเรียน</TableCell>
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
          <Label>ปีการศึกษา</Label>
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
          <Label>ภาคเรียน</Label>
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
          <Label>ระดับชั้น</Label>
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
          <Label>ห้อง</Label>
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
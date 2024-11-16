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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { StudentInClassroom, StudentInClassroomData } from '@/app/types/Settings/Students'
import { SubmitAddStudentInClassroom, SubmitEditStudentInClassroom, SubmitRemoveStudentInClassroom } from '@/app/action/settings/StudentInClassrooms'
import { Label } from '../ui/label'

interface StudentInClassroomEditProps {
  classroomOptions: {
    id: number,
    education_year: {
      id: number,
      name: string,
    },
    education_term: {
      id: number,
      name: string,
    },
    level: {
      id: number,
      name: string,
    },
    room: {
      id: number,
      name: string,
    },
  }[];
  editingStudentInClassroom: StudentInClassroomData | null;
  setEditingStudentInClassroom: (studentInclassroom: StudentInClassroomData | null) => void;
  handleUpdateStudentInClassroom: () => void;
}

export const ButtonSubmitFormAddStudentInClassroom = () => {
  const { pending } = useFormStatus()
  return (
    <Button disabled={pending} type='submit'>{pending ? "กำลังโหลด..." : "เพิ่มนักเรียนในห้องเรียน"}</Button>
  )
}

export const SearchStudentInClassroom = () => {
  const router = useRouter();
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');
  useEffect(() => {
    const query = new URLSearchParams();

    if (text.trim() !== '') {
      query.append('search', text);
    }

    if (status.trim() !== '') {
      query.append('status', status);
    }

    router.push(`/admin/student/classrooms?${query.toString()}`);
  }, [text, status, router]);

  return (
    <div className="mb-4">
      <Input
        type="text"
        placeholder="ค้นหานักเรียนในห้องเรียน..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full"
      />
      <div className="flex space-x-1 bg-secondary p-1 rounded-md mt-3">
        <Button
          variant={status === '' ? "default" : "ghost"}
          onClick={() => setStatus('')}
          className={`flex-1`}
        >
          ทั้งหมด
        </Button>
        <Button
          variant={status === 'done' ? "default" : "ghost"}
          onClick={() => setStatus('done')}
          className={`flex-1`}
        >
          ชำระแล้ว
        </Button>
        <Button
          variant={status === 'paying' ? "default" : "ghost"}

          onClick={() => setStatus('paying')}
          className={`flex-1`}
        >
          กำลังชำระ
        </Button>
        <Button
          variant={status === 'none' ? "default" : "ghost"}

          onClick={() => setStatus('none')}
          className={`flex-1`}
        >
          ยังไม่ชำระ
        </Button>
      </div>
    </div>
  );
};

interface StudentInClassroomAddProps {
  classroomOptions: {
    id: number,
    education_year: {
      id: number,
      name: string,
    },
    education_term: {
      id: number,
      name: string,
    },
    level: {
      id: number,
      name: string,
    },
    room: {
      id: number,
      name: string,
    },
  }[];
}

export const StudentInClassroomAdd: FC<StudentInClassroomAddProps> = ({ classroomOptions }) => {
  const ref = useRef<HTMLFormElement>(null);
  const handleSubmit = async (formData: FormData) => {
    try {
      const res: Res = await SubmitAddStudentInClassroom(formData);
      toast[res.type](res.message,{position: 'bottom-right'});
      if (res.type !== 'error') {
        ref.current?.reset();
        setSelectedValues({
          classroom: '',
          pay_status: '',
        });
      }
    } catch (error) {
      console.error('Failed to add studentInclassroom:', error);
      toast.error('ไม่สามารถเพื่มนักเรียนในห้องได้ กรุณาลองอีกครั้ง', { position: 'bottom-right' });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setSelectedValues((prev) => ({ ...prev, [name]: value }));
  };

  const [selectedValues, setSelectedValues] = useState({
    classroom: '',
    pay_status: ''
  });

  const payOptions = [{
    "label": "ยังไม่ชำระ",
    "value": "none",
  },
  {
    "label": "กำลังชำระ",
    "value": "paying",
  },
  {
    "label": "ชำระแล้ว",
    "value": "done",
  }
  ]
  return (
    <form ref={ref} action={async (formData: FormData) => {
      await handleSubmit(formData)
    }} method="post">
      <div className="flex space-x-2">
        <Input
          type='number'
          name='student_sid'
          placeholder="รหัสนักเรียน"
          required
        />
        <div className='w-full'>
          <Select name='classroom'
            value={selectedValues.classroom}
            onValueChange={(value) => handleSelectChange('classroom', value)}>
            <SelectTrigger id="classroom">
              <SelectValue placeholder="เลือกห้องเรียน" />
            </SelectTrigger>
            <SelectContent>
              {classroomOptions.map((classroom) => (
                <SelectItem key={classroom.id} value={classroom.id.toString()}>
                  {classroom.level.name}/{classroom.room.name} ปีการศึกษา {classroom.education_year.name} ภาคเรียนที่ {classroom.education_term.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Input
          type="number"
          name="no"
          placeholder="เลขที่"
          required
        />
        <div className="w-full">
          <Select
            value={selectedValues.pay_status}
            onValueChange={(value) => handleSelectChange('pay_status', value)}
            name="pay_status"
          >
            <SelectTrigger id="pay_status">
              <SelectValue placeholder="เลือกสถานะการชำระ" />
            </SelectTrigger>
            <SelectContent>
              {payOptions.map((pay, index) => (
                <SelectItem key={index} value={pay.value}>
                  {pay.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ButtonSubmitFormAddStudentInClassroom />
      </div>
    </form>
  )
}

export const ListStudentInClassrooms = ({ studentInclassrooms, classroomOptions }: {
  studentInclassrooms: StudentInClassroom,
  classroomOptions: {
    id: number,
    education_year: {
      id: number,
      name: string,
    },
    education_term: {
      id: number,
      name: string,
    },
    level: {
      id: number,
      name: string,
    },
    room: {
      id: number,
      name: string,
    },
  }[]
}) => {
  const [editingStudentInClassroom, setEditingStudentInClassroom] = useState<StudentInClassroomData | null>(null);
  const handleEditStudentInClassroom = (studentInclassroom: StudentInClassroomData) => {
    setEditingStudentInClassroom(studentInclassroom);
  };

  const handleUpdateStudentInClassroom = async () => {
    try {
      if (!editingStudentInClassroom) {
        return toast.error('ไม่สามารถแก้ไขนักเรียนในห้องเรียนได้ กรุณาลองอีกครั้ง', { position: 'bottom-right' });
      }
      const res: Res = await SubmitEditStudentInClassroom(editingStudentInClassroom);
      toast[res.type](res.message,{position: 'bottom-right'});
      setEditingStudentInClassroom(null);
    } catch (error) {
      console.error('Failed to edit student in classroom:', error);
      toast.error('ไม่สามารถแก้ไขนักเรียนในห้องเรียนได้ กรุณาลองอีกครั้ง', { position: 'bottom-right' });
    }
  };

  const handleRemoveStudentInClassroom = async (id: number) => {
    try {
      if (!id) {
        return toast.error('ไม่สามารถลบนักเรียนในห้องเรียนได้ กรุณาลองอีกครั้ง', { position: 'bottom-right' });
      }
      const res: Res = await SubmitRemoveStudentInClassroom(id);
      toast[res.type](res.message,{position: 'bottom-right'});
    } catch (error) {
      console.error('Failed to remove student in classroom:', error);
      toast.error('ไม่สามารถลบนักเรียนในห้องเรียนได้ กรุณาลองอีกครั้ง', { position: 'bottom-right' });
    }
  };

  const getPaymentStatusBadge = (payStatus: string) => {
    switch (payStatus) {
      case 'done':
        return <div className='text-green-500 dark:text-green-800 font-semibold'>ชำระครบเรียบร้อย</div>;
      case 'paying':
        return <div className='text-orange-500 dark:text-orange-800 font-semibold'>อยู่ระหว่างชำระ</div>;
      default:
        return <div className='text-red-500 dark:text-red-800 font-semibold'>ยังไม่ชำระ</div>;
    }
  };  

  return (
    <>
      <TablePagination pagination={studentInclassrooms.pagination} />
      <Table className='dark:bg-neutral-900/30'>
        <TableHeader className="bg-gradient-to-r from-slate-200 to-gray-200 dark:from-zinc-800 dark:to-gray-800">
          <TableRow>
            <TableHead className='dark:text-slate-200 text-slate-700'>รหัสนักเรียน</TableHead>
            <TableHead className='dark:text-slate-200 text-slate-700'>ภาคเรียน/ปีการศึกษา</TableHead>
            <TableHead className='dark:text-slate-200 text-slate-700'>ระดับชั้น/ห้อง</TableHead>
            <TableHead className='dark:text-slate-200 text-slate-700'>เลขที่</TableHead>
            <TableHead className='dark:text-slate-200 text-slate-700'>สถานะการชำระ</TableHead>
            <TableHead className='dark:text-slate-200 text-slate-700'>สร้างเมื่อ</TableHead>
            <TableHead className='dark:text-slate-200 text-slate-700'>อัพเดทเมื่อ</TableHead>
            <TableHead className='dark:text-slate-200 text-slate-700'>จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {studentInclassrooms.data && studentInclassrooms.data.length > 0 ? (
            studentInclassrooms.data.map((studentInclassroom) => (
              <TableRow key={studentInclassroom.id}>
                <TableCell>{studentInclassroom.student_sid}</TableCell>
                <TableCell>{studentInclassroom.classroom.education_term.name}/{studentInclassroom.classroom.education_year.name}</TableCell>
                <TableCell>{studentInclassroom.classroom.level.name}/{studentInclassroom.classroom.room.name}</TableCell>
                <TableCell>{studentInclassroom.no}</TableCell>
                <TableCell>{getPaymentStatusBadge(studentInclassroom.pay_status)}</TableCell>
                <TableCell className='text-blue-500'>{new Date(studentInclassroom.createdAt).toLocaleString()}</TableCell>
                <TableCell className='text-blue-500'>{new Date(studentInclassroom.updatedAt).toLocaleString()}</TableCell>
                <TableCell className='items-center justify-center flex flex-col md:flex-row gap-3'>
                  <Button variant="outline" className="w-full" onClick={() => handleEditStudentInClassroom(studentInclassroom)}>
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
                        <AlertDialogAction onClick={() => handleRemoveStudentInClassroom(Number(studentInclassroom.id))}>ลบ</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className='text-center' colSpan={10}>ไม่พบนักเรียนในห้องเรียน</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <StudentInClassroomEdit classroomOptions={classroomOptions} editingStudentInClassroom={editingStudentInClassroom} setEditingStudentInClassroom={setEditingStudentInClassroom} handleUpdateStudentInClassroom={handleUpdateStudentInClassroom} />
    </>
  )
}

export const StudentInClassroomEdit: FC<StudentInClassroomEditProps> = ({ classroomOptions, editingStudentInClassroom, setEditingStudentInClassroom, handleUpdateStudentInClassroom }) => {
  if (!editingStudentInClassroom) return null;
  const payOptions = [{
    "label": "ยังไม่ชำระ",
    "value": "none",
  },
  {
    "label": "กำลังชำระ",
    "value": "paying",
  },
  {
    "label": "ชำระแล้ว",
    "value": "done",
  }
  ]
  return (
    <AlertDialog open={!!editingStudentInClassroom} onOpenChange={() => setEditingStudentInClassroom(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>แก้ไขค่าบำรุงการศึกษา</AlertDialogTitle>
        </AlertDialogHeader>
        <Label>รหัสนักเรียน</Label>
        <Input
          type='number'
          value={editingStudentInClassroom.student_sid}
          onChange={(e) => setEditingStudentInClassroom({ ...editingStudentInClassroom, student_sid: Number(e.target.value) })}
        />
        <Label>ห้องเรียน</Label>
        <div className="w-full">
          <Select
            defaultValue={
              classroomOptions.find((classroom) => editingStudentInClassroom.classroom.id === classroom.id)?.id.toString() || ''
            }
            onValueChange={(value) => setEditingStudentInClassroom({ ...editingStudentInClassroom, classroom: { ...editingStudentInClassroom.classroom, id: parseInt(value) } })}
            name="classroom"
          >
            <SelectTrigger id="classroom">
              <SelectValue placeholder="เลือกห้องเรียน" />
            </SelectTrigger>
            <SelectContent>
              {classroomOptions.map((classroom) => (
                <SelectItem key={classroom.id} value={classroom.id.toString()}>
                  {classroom.level.name}/{classroom.room.name} ปีการศึกษา {classroom.education_year.name} ภาคเรียนที่ {classroom.education_term.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Label>เลขที่</Label>
        <Input
          type='number'
          value={editingStudentInClassroom.no}
          onChange={(e) => setEditingStudentInClassroom({ ...editingStudentInClassroom, no: Number(e.target.value) })}
        />
        <Label>สถานะการชำระ</Label>
        <div className="w-full">
          <Select
            defaultValue={
              payOptions.find((pay) => editingStudentInClassroom.pay_status === pay.value)?.value || ''
            }
            onValueChange={(value) => setEditingStudentInClassroom({ ...editingStudentInClassroom, pay_status: value as "none" | "paying" | "done", })}
            name="pay_status"
          >
            <SelectTrigger id="pay_status">
              <SelectValue placeholder="เลือกสถานะการชำระ" />
            </SelectTrigger>
            <SelectContent>
              {payOptions.map((pay, index) => (
                <SelectItem key={index} value={pay.value}>
                  {pay.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setEditingStudentInClassroom(null)}>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction onClick={handleUpdateStudentInClassroom}>แก้ไข</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
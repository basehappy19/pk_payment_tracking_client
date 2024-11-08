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
import { Badge } from '../ui/badge'
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
      toast[res.type](res.message);
      if (res.type !== 'error') {
        ref.current?.reset();
        setSelectedValues({
          classroom: '',
          pay_status: '',
        });
      }
    } catch (error) {
      console.error('Failed to add studentInclassroom:', error);
      toast.error('ไม่สามารถเพื่มนักเรียนในห้องได้ กรุณาลองอีกครั้ง');
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
        return toast.error('ไม่สามารถแก้ไขนักเรียนในห้องเรียนได้ กรุณาลองอีกครั้ง');
      }
      const res: Res = await SubmitEditStudentInClassroom(editingStudentInClassroom);
      toast[res.type](res.message);
      setEditingStudentInClassroom(null);
    } catch (error) {
      console.error('Failed to edit student in classroom:', error);
      toast.error('ไม่สามารถแก้ไขนักเรียนในห้องเรียนได้ กรุณาลองอีกครั้ง');
    }
  };

  const handleRemoveStudentInClassroom = async (id: number) => {
    try {
      if (!id) {
        return toast.error('ไม่สามารถลบนักเรียนในห้องเรียนได้ กรุณาลองอีกครั้ง');
      }
      const res: Res = await SubmitRemoveStudentInClassroom(id);
      toast[res.type](res.message);
    } catch (error) {
      console.error('Failed to remove student in classroom:', error);
      toast.error('ไม่สามารถลบนักเรียนในห้องเรียนได้ กรุณาลองอีกครั้ง');
    }
  };

  const getPaymentStatusBadge = (payStatus: string) => {
    switch (payStatus) {
      case 'done':
        return <Badge variant="default">ชำระครบเรียบร้อย</Badge>;
      case 'paying':
        return <Badge variant="secondary">อยู่ระหว่างชำระ</Badge>;
      default:
        return <Badge variant="destructive">ยังไม่ชำระ</Badge>;
    }
  };

  return (
    <>
      <TablePagination pagination={studentInclassrooms.pagination} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>รหัสนักเรียน</TableHead>
            <TableHead>ปีการศึกษา</TableHead>
            <TableHead>ภาคเรียนที่</TableHead>
            <TableHead>ระดับชั้น</TableHead>
            <TableHead>ห้อง</TableHead>
            <TableHead>เลขที่</TableHead>
            <TableHead>สถานะการชำระ</TableHead>
            <TableHead>สร้างเมื่อ</TableHead>
            <TableHead>อัพเดทเมื่อ</TableHead>
            <TableHead>จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {studentInclassrooms.data && studentInclassrooms.data.length > 0 ? (
            studentInclassrooms.data.map((studentInclassroom) => (
              <TableRow key={studentInclassroom.id}>
                <TableCell>{studentInclassroom.student_sid}</TableCell>
                <TableCell>{studentInclassroom.classroom.education_year.name}</TableCell>
                <TableCell>{studentInclassroom.classroom.education_term.name}</TableCell>
                <TableCell>{studentInclassroom.classroom.level.name}</TableCell>
                <TableCell>{studentInclassroom.classroom.room.name}</TableCell>
                <TableCell>{studentInclassroom.no}</TableCell>
                <TableCell>{getPaymentStatusBadge(studentInclassroom.pay_status)}</TableCell>
                <TableCell>{new Date(studentInclassroom.createdAt).toLocaleString()}</TableCell>
                <TableCell>{new Date(studentInclassroom.updatedAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Button variant="outline" className="mr-2" onClick={() => handleEditStudentInClassroom(studentInclassroom)}>แก้ไข</Button>
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
          <AlertDialogTitle>แก้ไขค่าธรรมเนียม</AlertDialogTitle>
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
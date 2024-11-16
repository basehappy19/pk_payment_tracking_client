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
import { Room, RoomData } from '@/app/types/Settings/Rooms'
import { SubmitAddRoom, SubmitEditRoom, SubmitRemoveRoom } from '@/app/action/settings/Rooms'
import { Res } from '@/app/types/Settings/Response'
import { Label } from '../ui/label'

interface RoomEditProps {
  editingRoom: RoomData | null;
  setEditingRoom: (room: RoomData | null) => void;
  handleUpdateRoom: () => void;
}

export const ButtonSubmitFormAddRoom = () => {
  const { pending } = useFormStatus()
  return (
    <Button disabled={pending} type='submit'>{pending ? "กำลังโหลด..." : "เพิ่มห้อง"}</Button>
  )
}

export const SearchRoom = () => {
  const router = useRouter();
  const [text, setText] = useState('');
  useEffect(() => {
    if (!text || text.trim() === '') {
      router.push(`/admin/rooms`);
    } else {
      const debounceTimer = setTimeout(() => {
        router.push(`/admin/rooms?search=${text}`);
      }, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [text, router]);

  return (
    <div className="mb-4">
      <Input
        type="text"
        placeholder="ค้นหาห้อง..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full"
      />
    </div>
  );
};

export const RoomAdd = () => {
  const ref = useRef<HTMLFormElement>(null);
  const handleSubmit = async (formData: FormData) => {
    try {
      const res : Res = await SubmitAddRoom(formData);
      toast[res.type](res.message,{position: 'bottom-right'});
      if(res.type !== 'error'){
        ref.current?.reset();
      }
    } catch (error) {
      console.error('Failed to add room:', error);
      toast.error('ไม่สามารถเพื่มห้องได้ กรุณาลองอีกครั้ง', { position: 'bottom-right' });
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
          placeholder="ระบุห้องใหม่"
          required
        />
        <ButtonSubmitFormAddRoom />
      </div>
    </form>
  )
}

export const ListRooms = ({ rooms }: { rooms: Room }) => {
  const [editingRoom, setEditingRoom] = useState<RoomData | null>(null);
  const handleEditRoom = (room: RoomData) => {
    setEditingRoom(room);
  };

  const handleUpdateRoom = async () => {
    try {
      if (!editingRoom) {
        return toast.error('ไม่สามารถแก้ไขห้องได้ กรุณาลองอีกครั้ง');
      }
      const res : Res = await SubmitEditRoom(editingRoom);
      toast[res.type](res.message,{position: 'bottom-right'});
      setEditingRoom(null);
    } catch (error) {
      console.error('Failed to edit room:', error);
      toast.error('ไม่สามารถแก้ไขห้องได้ กรุณาลองอีกครั้ง', { position: 'bottom-right' });
    }
  };

  const handleRemoveRoom = async (id: number) => {
    try {
      if (!id) {
        return toast.error('ไม่สามารถลบห้องได้ กรุณาลองอีกครั้ง', { position: 'bottom-right' });
      }
      const res : Res = await SubmitRemoveRoom(id);
      toast[res.type](res.message,{position: 'bottom-right'});
    } catch (error) {
      console.error('Failed to remove room:', error);
      toast.error('ไม่สามารถลบห้องได้ กรุณาลองอีกครั้ง', { position: 'bottom-right' });
    }
  };
  
  return (
    <>
      <TablePagination pagination={rooms.pagination} />
      <Table className='dark:bg-neutral-900/30'>
        <TableHeader className="bg-gradient-to-r from-slate-200 to-gray-200 dark:from-zinc-800 dark:to-gray-800">
          <TableRow>
            <TableHead className='dark:text-slate-200 text-slate-700'>ห้อง</TableHead>
            <TableHead className='dark:text-slate-200 text-slate-700'>สร้างเมื่อ</TableHead>
            <TableHead className='dark:text-slate-200 text-slate-700'>อัพเดทเมื่อ</TableHead>
            <TableHead className='dark:text-slate-200 text-slate-700'>จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms.data && rooms.data.length > 0 ? (
            rooms.data.map((room) => (
              <TableRow key={room.id}>
                <TableCell>{room.name}</TableCell>
                <TableCell className='text-blue-500'>{new Date(room.createdAt).toLocaleString()}</TableCell>
                <TableCell className='text-blue-500'>{new Date(room.updatedAt).toLocaleString()}</TableCell>
                <TableCell className='items-center justify-center flex flex-col md:flex-row gap-3'>
                  <Button variant="outline" className="w-full" onClick={() => handleEditRoom(room)}>
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
                        <AlertDialogAction onClick={() => handleRemoveRoom(Number(room.id))}>ลบ</AlertDialogAction>
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
      <RoomEdit editingRoom={editingRoom} setEditingRoom={setEditingRoom} handleUpdateRoom={handleUpdateRoom} />
    </>
  )
}

export const RoomEdit: FC<RoomEditProps> = ({ editingRoom, setEditingRoom, handleUpdateRoom }) => {
  if (!editingRoom) return null;

  return (
    <AlertDialog open={!!editingRoom} onOpenChange={() => setEditingRoom(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>แก้ไขห้อง</AlertDialogTitle>
        </AlertDialogHeader>
        <Label>
          ห้อง
        </Label>
        <Input
          value={editingRoom.name}
          onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
        />
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setEditingRoom(null)}>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction onClick={handleUpdateRoom}>แก้ไข</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
'use server'

import { AddClassroom, EditClassroom, RemoveClassroom } from "@/app/functions/settings/classrooms/Classrooms";
import { ClassroomData } from "@/app/types/Settings/Classrooms";
import { revalidatePath } from "next/cache";

export async function SubmitAddClassroom(formData: FormData) {
  const education_year = formData.get('education_year') as string;
  const education_term = formData.get('education_term') as string;
  const level = formData.get('level') as string;
  const room = formData.get('room') as string;

  if (!education_year) {
    return { message:"กรุณาระบุปีการศึกษา",type:"error" };
  }

  if (!education_term) {
    return { message:"กรุณาระบุภาคเรียน",type:"error" };
  }

  if (!level) {
    return { message:"กรุณาระบุระดับชั้น",type:"error" };
  }

  if (!room) {
    return { message:"กรุณาระบุห้อง",type:"error" };
  }

  const res = await AddClassroom({ education_year: parseInt(education_year), education_term: parseInt(education_term), level: parseInt(level), room: parseInt(room) });

  revalidatePath('/admin/education/classrooms');
  return res;
}

export async function SubmitEditClassroom(classroom: ClassroomData) {
  const { id, education_year, education_term, level, room } = classroom
  
  if (!id) {
    return { message:"ไม่สามารถแก้ไขห้องได้ กรุณาลองใหม่อีกครั้ง",type:"error" };
  }

  if (!education_year) {
    return { message:"กรุณาระบุปีการศึกษา",type:"error" };
  }

  if (!education_term) {
    return { message:"กรุณาระบุภาคเรียน",type:"error" };
  }

  if (!level) {
    return { message:"กรุณาระบุระดับชั้น",type:"error" };
  }

  if (!room) {
    return { message:"กรุณาระบุห้อง",type:"error" };
  }
  
  const res = await EditClassroom(classroom)
  revalidatePath('/admin/classrooms');
  return res;
}

export async function SubmitRemoveClassroom(id: number) {
  if (!id) {
    return { message:"ไม่สามารถลบห้องได้ กรุณาลองใหม่อีกครั้ง",type:"error" };
  }
  
  const res = await RemoveClassroom(id)
  revalidatePath('/admin/classrooms');
  return res;
}

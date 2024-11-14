'use server'

import { revalidatePath } from "next/cache";
import { AddImportDataByCSV } from "../functions/imports/Import";
import { CSVData } from "@/components/Settings/Import";

export async function SubmitAddImportData(formData: FormData) {
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
  
    // const res = await AddClassroom({ education_year: parseInt(education_year), education_term: parseInt(education_term), level: parseInt(level), room: parseInt(room) });
  
    // revalidatePath('/admin/education/classrooms');
    // return res;
}

export async function SubmitAddImportDataByCSV(CSVData: CSVData[]) {
  const res = await AddImportDataByCSV(CSVData);
  revalidatePath('/admin/imports');
  return res;
}
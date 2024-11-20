import { getStudents } from '@/app/functions/settings/students/Students';
import { Student } from '@/app/types/Settings/Students';
import { ListStudents, SearchStudent, StudentAdd } from '@/components/Settings/Student';
import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'จัดการนักเรียน | โรงเรียนภูเขียว',
    description: 'จัดการนักเรียน โรงเรียนภูเขียว',
}

export default async function ManageStudent({searchParams}:{
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;    
    const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : undefined;    
    const students : Student = await getStudents({search:search,page:page})
    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">จัดการนักเรียน</h1>

            <StudentAdd />
            <SearchStudent />
            <ListStudents students={students} />
        </div>
    )
}

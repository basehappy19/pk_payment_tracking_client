import React from 'react'
import type { Metadata } from 'next'
import { StudentReceipt } from '@/app/types/Settings/Students';
import { ListStudentReceipts, SearchStudentReceipt, StudentReceiptAdd } from '@/components/Settings/StudentReceipt';
import { getStudentReceipts } from '@/app/functions/settings/students/StudentReceipt';
import { getReceiptBookOptions } from '@/app/functions/settings/receiptBooks/ReceiptBooks';

export const metadata: Metadata = {
    title: 'จัดการใบเสร็จนักเรียน | โรงเรียนภูเขียว',
    description: 'จัดการใบเสร็จนักเรียน โรงเรียนภูเขียว',
}

export default async function ManageStudent({searchParams}:{
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;    
    const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : undefined;    
    const studentReceipts : StudentReceipt = await getStudentReceipts({search:search,page:page});
    const receiptBookOptions = await getReceiptBookOptions();
    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">จัดการใบเสร็จนักเรียน</h1>

            <StudentReceiptAdd receiptBookOptions={receiptBookOptions} />
            <SearchStudentReceipt />
            <ListStudentReceipts receiptBookOptions={receiptBookOptions} studentReceipts={studentReceipts} />
        </div>
    )
}

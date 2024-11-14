import { getImportOptions } from '@/app/functions/imports/Import'
import { Option } from '@/app/types/import'
import { AddImportData, ImportCSV } from '@/components/Settings/Import'
import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
    title: 'นำเข้าข้อมูล | โรงเรียนภูเขียว',
    description: 'นำเข้าข้อมูล โรงเรียนภูเขียว',
}

const ImportPage = async () => {
    const options : Option = await getImportOptions()
    
    return (
        <div className="p-4 space-y-8">
            <h1 className="text-2xl font-bold">นำเข้าข้อมูล</h1>

            <AddImportData options={options} />
            <ImportCSV />
        </div>
    )
}

export default ImportPage
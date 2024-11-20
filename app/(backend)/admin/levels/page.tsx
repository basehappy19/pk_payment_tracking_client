import { getLevels } from '@/app/functions/settings/levels/Levels';
import { Level } from '@/app/types/Settings/Levels';
import { LevelAdd, ListLevels, SearchLevel } from '@/components/Settings/Level';
import React from 'react'
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'จัดการระดับชั้น | โรงเรียนภูเขียว',
  description: 'จัดการระดับชั้น โรงเรียนภูเขียว',
}

export default async function ManageLevel({searchParams}:{
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;    
    const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : undefined;    
    const levels : Level = await getLevels({search:search,page:page})
    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">จัดการระดับชั้น</h1>

            <LevelAdd />
            <SearchLevel />
            <ListLevels levels={levels} />
        </div>
    )
}

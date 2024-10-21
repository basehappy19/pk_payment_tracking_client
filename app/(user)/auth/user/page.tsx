import CardLoginUser from '@/components/auth/CardLoginUser'
import React from 'react'
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'เข้าสู่ระบบระบบตรวจสอบค่าธรรมเนียม | โรงเรียนภูเขียว',
  description: 'เข้าสู่ระบบระบบตรวจสอบค่าธรรมเนียม โรงเรียนภูเขียว',
}

export default function LoginUser() {
    return (
        <CardLoginUser />
    )
}

import CardLoginStudent from '@/components/auth/CardLoginStudent'
import React from 'react'
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'ตรวจสอบค่าธรรมเนียมสำหรับนักเรียน | โรงเรียนภูเขียว',
  description: 'ตรวจสอบค่าธรรมเนียมสำหรับนักเรียน โรงเรียนภูเขียว',
}

export default function LoginStudent() {
  return (
    <CardLoginStudent />
  )
}

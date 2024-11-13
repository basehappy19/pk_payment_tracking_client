import React from 'react';
import { CheckFeeStudent } from '@/app/functions/fees/CheckFee';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const status: Status = await CheckFeeStudent();
 
  return {
    title: `ค่าบำรุงการศึกษาของ ${status.name} | โรงเรียนภูเขียว`,
    description: 'ระบบตรวจสอบค่าบำรุงการศึกษา โรงเรียนภูเขียว',
  }
}

interface Status {
  sid: number;
  name: string;
  studentInClassroom: [{
    no: number;
    pay_status: string;
    classroom: {
      levels_id: number;
      room_id: number;
      education_year: {
        name: string;
      };
      education_term: {
        name: string;
      };
      feeForClassrooms: [{
        id: number;
        fee: {
          amount: string;
          name: string;
        };
      }];
    };
  }];
  total_fee_amount: number;
}

export default async function StudentDashboard() {
  const status: Status = await CheckFeeStudent();

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
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">ตรวจสอบการชำระค่าบำรุงการศึกษา</h1>

      <Card>
        <CardHeader>
          <CardTitle>สวัสดี, {status.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">ยอดค่าบำรุงการศึกษาทั้งหมด</h3>
              <p className="text-3xl font-bold text-blue-500">{status.total_fee_amount.toString()} บาท</p>
              <p className="text-sm text-muted-foreground mt-2">
                ประจำปีการศึกษา {status.studentInClassroom[0].classroom.education_year.name} เทอม {status.studentInClassroom[0].classroom.education_term.name}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">สถานะการชำระเงิน</h3>
              {getPaymentStatusBadge(status.studentInClassroom[0].pay_status)}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>รายการชำระทั้งหมด</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>รายการ</TableHead>
                <TableHead className="text-right">จำนวนเงิน</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {status.studentInClassroom[0].classroom.feeForClassrooms.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell>{fee.fee.name}</TableCell>
                  <TableCell className="text-right">{fee.fee.amount.toString()} บาท</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
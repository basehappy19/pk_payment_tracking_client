import { FeeForClassroom } from "./Fee"

export interface Student {
    student_sid: number,
    student: {
        name: string,
    },
    no: number,
    pay_status: string,
    studentReceipts: StudentReceipts[]
    classroom: {
        level_id: number,
        room_id: number,
        education_year: {
            name: string
        },
        education_term: {
            name: string
        },
        feeForClassrooms: FeeForClassroom[]
    },
    total_payment_amount: number,
}


interface StudentReceipts {
    amount:number,
    receiptBook:{
        name:string,
        total_page:number
    },

}



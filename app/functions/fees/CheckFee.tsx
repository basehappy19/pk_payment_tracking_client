'use server'
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"
import { getServerSession } from "next-auth"

export const CheckFeeStudent = async () => {
    try {
        const session = await getServerSession(authOptions);
        if(!session){
            return null;
        }
        const token = session.accessToken;
        const res = await fetch(process.env.NEXT_PUBLIC_APP_API + "/student_fee_checks",{
            method: 'POST',
            headers: {
                'authorization': token,
            },
        })
        if (!res.ok) {
            return null
        }
        const data = res.json();
        return data;
    } catch (err) {
        console.error('Error CheckStatus:', err);
        throw err;
    }
}

export const CheckFeeStudentAll = async (year:string,term:string,level:string,room:string) => {
    try {
        const session = await getServerSession(authOptions);
        if(!session){
            return null;
        }
        const token = session.accessToken;
        const res = await fetch(process.env.NEXT_PUBLIC_APP_API + "/student_fee_all",{
            method: 'POST',
            headers: {
                'authorization': token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                education_year_id:parseInt(year),
                education_term_id:parseInt(term),
                level_id:parseInt(level),
                room_id:parseInt(room) 
            }),
            next:{
                revalidate: 0
            }
        })
        if (!res.ok) {
            return null
        }
        
        return res.json();
    } catch (err) {
        console.error('Error Fetch Students:', err);
        throw err;
    }
}
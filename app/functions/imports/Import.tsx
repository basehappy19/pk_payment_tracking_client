'use server'
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { getServerSession } from "next-auth";

export const getImportOptions = async () => {
    try {
      const session = await getServerSession(authOptions);
  
      if (!session) {
        return null;
      }
  
  
      const res = await fetch(process.env.NEXT_PUBLIC_APP_API + '/import_options', {
        method: 'GET',
        headers: {
          authorization: session.accessToken,
        },
        next: {
          revalidate: 0,
        },
      });
  
      if (!res.ok) {
        return null;
      }
  
      return res.json();
    } catch (e) {
      console.error('Failed To Fetch Import Options: ', e);
      throw e;
    }
};
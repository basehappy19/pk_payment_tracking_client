import { Button } from '@/components/ui/button';
import { File } from 'lucide-react';
import Link from 'next/link';

const ExportVerifyPdf = () => {
    return (
        <Link target='_blank' href={'/api/fee/verify'}>
            <Button className='w-full mt-2'><File /> ส่งออกใบยืนยันการชำระ</Button>
        </Link>
    )
}

export default ExportVerifyPdf
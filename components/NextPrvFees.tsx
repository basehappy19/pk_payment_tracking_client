'use client'
import { StatusPagination } from "@/app/(user)/(students)/fee/page";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const NextPrvFees = ({ pagination }: { pagination: StatusPagination }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentIndex = parseInt(searchParams.get('index') || '0', 10);

    const [index, setIndex] = useState(currentIndex);

    useEffect(() => {
        setIndex(currentIndex);
    }, [currentIndex]);

    const handleBack = () => {
        if (index > 0) {
            const newIndex = index - 1;
            if (newIndex === 0) {
                router.push(`/fee`);
                return;
            }
            router.push(`?index=${newIndex}`);
        }
    };

    const handleNext = () => {
        if (index < pagination.total - 1) {
            const newIndex = index + 1;
            if (newIndex === 0) {
                router.push(`/fee`);
                return;
            }
            router.push(`?index=${newIndex}`);
        }
    };

    return (
        <div className="flex justify-between mt-4">
            <div className={`${pagination.next.data !== null ? "block" : "opacity-50"}`}>
                <button
                    onClick={handleNext}
                    disabled={index >= pagination.total - 1}
                    className={`bg-blue-400 text-black font-medium p-3 rounded-md`}
                >
                    ย้อนหลับ{" "}
                    {pagination.next.data !== null && (
                        <>
                            {pagination.next.data.classroom.education_term.name}/{pagination.next.data.classroom.education_year.name}
                        </>
                    )}

                </button>
            </div>
            <button
                onClick={handleBack}
                disabled={index === 0}
                className="bg-green-400 text-black font-medium p-3 rounded-md"
            >
                {index === 0 ? "ปีการศึกษาล่าสุดแล้ว" : "ถัดไป "}
                {pagination.prev.data !== null && (
                    <>
                        {pagination.prev.data.classroom.education_term.name}/{pagination.prev.data.classroom.education_year.name}
                    </>
                )}
            </button>
        </div>
    );
};

export default NextPrvFees;

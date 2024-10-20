'use client'
import React, { FC, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClassroomOptions } from '@/app/types/classroom';
import StudentFeeInClassrooms from './StudentFeeInClassrooms';
import Loading from './Loading';

interface ClassroomDisplayProps {
    options: ClassroomOptions
}

const ClassroomDisplay : FC<ClassroomDisplayProps> = ({ options }) => {
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [selectedTerm, setSelectedTerm] = useState<string>("");
    const [selectedLevel, setSelectedLevel] = useState<string>("");
    const [selectedRoom, setSelectedRoom] = useState<string>("");
    const [isLoading, setLoading] = useState<boolean>(false);
    
    useEffect(() => {
        if (selectedYear && selectedTerm && selectedLevel && selectedRoom) {
            setLoading(true)
        };
    }, [selectedYear, selectedTerm, selectedLevel, selectedRoom])

    return (
        <main className="container mx-auto p-4">
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">ตรวจสอบค่าธรรมเนียมนักเรียน</CardTitle>
                    {selectedYear && selectedTerm && selectedLevel && selectedRoom && (
                       <p className='text-center'>ชั้นมัธยมศึกษาปีที่ {selectedLevel}/{selectedRoom} ปีการศึกษา {selectedYear} เทอม {selectedTerm}</p> 
                    )}
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <Label htmlFor="education_year">ปีการศึกษา</Label>
                            <Select value={selectedYear} onValueChange={setSelectedYear}>
                                <SelectTrigger id="education_year">
                                    <SelectValue placeholder="เลือกปีการศึกษา" />
                                </SelectTrigger>
                                <SelectContent>
                                    {options.education_years.map((year) => (
                                        <SelectItem key={year.id} value={year.id.toString()}>
                                            {year.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="education_term">ภาคเรียน</Label>
                            <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                                <SelectTrigger id="education_term">
                                    <SelectValue placeholder="เลือกภาคเรียน" />
                                </SelectTrigger>
                                <SelectContent>
                                    {options.education_terms.map((term) => (
                                        <SelectItem key={term.id} value={term.id.toString()}>
                                            {term.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="level">ระดับชั้น</Label>
                            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                                <SelectTrigger id="level">
                                    <SelectValue placeholder="เลือกระดับชั้น" />
                                </SelectTrigger>
                                <SelectContent>
                                    {options.levels.map((level) => (
                                        <SelectItem key={level.id} value={level.id.toString()}>
                                            {level.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="room">ห้องเรียน</Label>
                            <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                                <SelectTrigger id="room">
                                    <SelectValue placeholder="เลือกห้องเรียน" />
                                </SelectTrigger>
                                <SelectContent>
                                    {options.rooms.map((room) => (
                                        <SelectItem key={room.id} value={room.id.toString()}>
                                            {room.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {!isLoading ? (
                <StudentFeeInClassrooms onLoading={setLoading} year={selectedYear} term={selectedTerm} level={selectedLevel} room={selectedRoom} />
            ):(
                <Loading />
            )}
        </main>
    );
};

export default ClassroomDisplay
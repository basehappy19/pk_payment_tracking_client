import { BookCopy, BookUser, CircleDollarSign, GraduationCap, ListOrdered, Receipt, SquareStack, University, UsersRound, WalletCards } from "lucide-react";

export const sideBarMenu = [
    {
        "label":"ปีการศึกษา",
        "path":"/admin/education/years",
        "icon": <GraduationCap />
    },
    {
        "label":"ภาคเรียน",
        "path":"/admin/education/terms",
        "icon": <University />
    },
    {
        "label":"ระดับชั้น",
        "path":"/admin/levels",
        "icon": <ListOrdered />
    },
    {
        "label":"ห้อง",
        "path":"/admin/rooms",
        "icon": <SquareStack />
    },
    {
        "label":"นักเรียน",
        "path":"/admin/students",
        "icon": <UsersRound />
    },
    {
        "label":"ห้องเรียน",
        "path":"/admin/classrooms",
        "icon": <SquareStack />
    },
    {
        "label":"นักเรียนในห้องเรียน",
        "path":"/admin/students/classroom",
        "icon": <BookUser />
    },
    {
        "label":"ค่าธรรมเนียม",
        "path":"/admin/fees",
        "icon": <CircleDollarSign />
    },
    {
        "label":"ค่าธรรมเนียมของห้องเรียน",
        "path":"/admin/classrooms/fee",
        "icon": <WalletCards />
    },
    {
        "label":"เล่มใบเสร็จ",
        "path":"/admin/receiptBooks",
        "icon": <BookCopy />
    },
    {
        "label":"ใบเสร็จของนักเรียน",
        "path":"/admin/studentReceipts",
        "icon": <Receipt />
    },
]
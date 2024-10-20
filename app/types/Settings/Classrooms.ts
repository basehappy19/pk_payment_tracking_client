import { Pagination } from "./Pagination";

export interface Classroom {
    data:ClassroomData[],
    pagination: Pagination
}

export interface ClassroomData {
    id:number,
    level:{
        id:number,
        name:string,
    },
    room:{
        id:number,
        name:string,
    },
    education_year:{
        id:number,
        name:string,
    },
    education_term:{
        id:number,
        name:string,
    },
    createdAt:string,
    updatedAt:string,
}

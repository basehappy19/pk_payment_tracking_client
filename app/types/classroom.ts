export interface ClassroomOptions {
    education_years:educationYears[],
    education_terms:educationTerms[],
    levels:Levels[],
    rooms:Rooms[],
}

interface educationYears {
    id:number,
    name:string,
}

interface educationTerms {
    id:number,
    name:string,
}

interface Levels {
    id:number,
    name:string,
}

interface Rooms {
    id:number,
    name:string,
}
export interface User {
    id: number,
    firstName: string,
    lastName: string,
    name?: string,
    motto?: string,
    groups?: string[],
    distance?: number,
    mutual_friends?: any[]
}

export interface UserNode {
    id: number;
    label: string;
}
import { number } from "joi"

export interface IActiveUser {
    sub: number;
    email: string;
}
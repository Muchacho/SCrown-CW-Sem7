import { Prisma } from '@prisma/client';

export class User implements Prisma.usersCreateInput{
    id?: number; 
    nickname?: string;
    email?: string;
    imgpath?: string;
    password?: string;
    role?: string;
    score?: number;   
    countofwin?: number;
    countoflose?: number;  
    banned?: boolean;
    banreason?: string;
}
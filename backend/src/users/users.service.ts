import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import * as Bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {

    constructor(private prisma: PrismaService){ }
    
    async getAllUsers(): Promise<User[] | null>{
        let arr = await this.prisma.users.findMany()
        console.log(arr.length);
        return arr;
    }
    
    async getClient(id: number) {
        return await this.prisma.users.findUnique({where: {id}});
    }

    async getUser(userDto: CreateUserDto): Promise<User | null>{
        if(userDto.nickname){
            console.log('----------- try to userdto------------');
            console.log(userDto);
            return this.prisma.users.findFirst({
                where: {
                    nickname: userDto.nickname
                }
            });
        } else if(userDto.email){
            return this.prisma.users.findFirst({
                where: {
                    email: userDto.email
                }
            });
        } else 
            return null;
    }

    async getBasikInfo(userDto: CreateUserDto): Promise<User | null>{
        return this.prisma.users.findFirst({
            where: userDto,
            select: {
                id: true,
                nickname: true,
                email: true,
                score: true,
                countoflose: true,
                countofwin: true
            }                
        });
        // return null;
    }
    
    async createUser(data: CreateUserDto): Promise<User>{
        return this.prisma.users.create({
            data
        });
    }
    
    async updateUser(userDto: CreateUserDto, id: number, nickname: string): Promise<User | null>{
        if(userDto.password){
            const hashPassword = await Bcrypt.hash(userDto.password, 5);
            await this.prisma.users.update({
                where: {id},
                data: {
                    nickname: userDto.nickname ? userDto.nickname : nickname,
                    password: hashPassword
                }
            })
        } else {
            await this.prisma.users.update({
                where: {id},
                data: {
                    nickname: userDto.nickname ? userDto.nickname : nickname
                }
            })
        }
        return null;
    }

    async deleteUser(id: number){
        return await this.prisma.users.delete({
            where: {
                id
            }
        });
    }

    async setWinnerRating(id: number){
        let winner = await this.prisma.users.findFirst({
            where: {
                id
            }
        })
        await this.prisma.users.update({
            where: { id },
            data: { 
                score: winner.score + 100,
                countofwin: winner.countofwin + 1
            }
        })
    }

    async setLooserRating(id: number){
        let looser = await this.prisma.users.findFirst({
            where: {
                id
            }
        })
        await this.prisma.users.update({
            where: { id },
            data: { 
                countoflose: looser.countoflose + 1
            }
        })
    }

    async getHistory(userid: number){
        let game = await this.prisma.history.findMany({
            where: { userid },
            select: {
                game: {
                    select: {
                        winner: true,
                        gamedate: true
                    }
                }
            }
        })
        let history = [];
        let winner;
        for(let item in game){
            winner = await this.prisma.users.findFirst({
                where: {
                    id: game[item].game.winner
                }
            })
            history.push({
                winner: winner.nickname,
                winnerId: winner.id,
                gamedate: game[item].game.gamedate
            });
        }
        return history;
    }

    async setBan(id: number, mode: string){
        console.log('ban')
        await this.prisma.users.update({
            where: {id},
            data: {
                banned: mode == 'ban' ? true : false
            }
        })
        return null;
    }
}

import { Get, Post, Put, Delete, Controller, Param, Body, Req, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('/users')
export class UsersController {

    constructor(private readonly usersServive: UsersService) {}

    @Get()
    async getAllUsers(@Req() req: any): Promise<User[] | null>{
        console.log('get all users');
        return this.usersServive.getAllUsers();
    }
     
    @Get('/client/:id')
    async getClient(@Req() req: any, @Param('id') id: number){
        console.log(id);
        return await this.usersServive.getClient(+id);
    }

    @Get('/profile')
    async getUserProfile(@Req() req: any){
        console.log(req.user);
        const user: User = {
            id: req.user.id,
            nickname: req.user.nickname,
            email: req.user.email,
            score: req.user.score,
            countofwin: req.user.countofwin,
            countoflose: req.user.countoflose,
            imgpath: req.user.imgpath
        }
        return user;
    }
     

    @Post()
    async createUser(@Body() userDto: CreateUserDto): Promise<User>{
        return this.usersServive.createUser(userDto);
    }

    @Put()
    async updateUser(@Req() req: any, @Body() userDto: CreateUserDto): Promise<User | null>{
        console.log(userDto);
        return this.usersServive.updateUser(userDto, req.user.id, req.user.nickname);
        return;
    }

    @Delete('/:id')
    async deleteUser(@Param('id') id: number){
        return await this.usersServive.deleteUser(+id);
    }

    @Post('/setWinnerRating')
    async setWinnerRating(@Body('winnerId') winnerId: number){
        console.log('update db winner: ' + winnerId);
        await this.usersServive.setWinnerRating(+winnerId);
        return true;
    }

    @Post('/setLooserRating')
    async setLooserRating(@Body('id') id: number){
        console.log('update db looser: ' + id);
        await this.usersServive.setLooserRating(+id);
        return true;
    }

    @Get('/history/:id')
    async getHistory(@Param('id') id: number){
        return await this.usersServive.getHistory(+id);
    }

    @Get('/ban/:id/:mode')
    async setBan(@Param('id') id: number, @Param('mode') mode: string, @Req() req:any){
        if(req.user.role != 'admin') throw new UnauthorizedException('Forbidden');
        return await this.usersServive.setBan(+id, mode);
    }
} 

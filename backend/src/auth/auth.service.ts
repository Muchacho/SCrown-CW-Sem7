import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as Bcrypt from 'bcryptjs';


@Injectable()
export class AuthService {

    constructor(private usersService: UsersService,
                private jswService: JwtService) {}

    async login(userDto: CreateUserDto){
        let user;
        try{
            user = await this.validateUser(userDto);
        }catch(err){
            console.log(err);
            return {statuscode: 3, message: err.response.message}
        }
        if(user.banned){
            return {statuscode: 1, message: 'User banned'}
        }
        const {token} = await this.generateToken(user);
        const data = {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
            impPath: user.imgpath,
            token: token,
            role: user.role
        }
        return data;
    }
    
    async registration(userDto: CreateUserDto){
        console.log(userDto);
        let candidate = await this.usersService.getUser(userDto);
        if(candidate) {
            return {statuscode: 2, message: 'This user already exist'}
            // throw new HttpException('This user already exist', HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await Bcrypt.hash(userDto.password, 5);
        try{
            const user = await this.usersService.createUser({
                ...userDto, password: hashPassword
            });
            const {token} = await this.generateToken(user);
            const data = {
                id: user.id,
                email: user.email,
                nickname: user.nickname,
                impPath: user.imgpath,
                token: token,
                role: user.role
            }
            return data;
        } catch(err){
            return {statuscode: 3, message: 'User with same email already exist'}
        }
    }
    
    private async validateUser(userDto: CreateUserDto) {
        const user = await this.usersService.getUser(userDto);
        if(user){
            const passwordEquals = await Bcrypt.compare(userDto.password, user.password);
            if(passwordEquals)
                return user;
            throw new UnauthorizedException({message:'Wrong password'});
        }    
        throw new UnauthorizedException({message:'User doesn`t exist'});
    }
    
    private async generateToken(user){
        const payload = {email: user.email, id: user.id, role: user.role};
        return {
            token: this.jswService.sign(payload)
        };
    }
    
}
import { error } from 'console';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware{

    constructor(private usersService: UsersService,
        private jswService: JwtService) {}
        
    async use(req: Request, res: Response, next: NextFunction) {
        try{
            if(!req.headers["authorization"]){console.log('auth forbiden middle');return res.status(403).json({message:"Forbidden"});}
            let token = req.headers["authorization"].split(' ')[1];
            let data = await this.jswService.verify(token, {secret: process.env.PRIVATE_KEY});
            let user = await this.usersService.getUser({email: data.email});       
            req['user'] = user;
            next();
        } catch(error) {
            console.log(error.message, 1234);
            res.status(500).json({message: 'Что-то пошло не так(auth)'});
        }
    }
}

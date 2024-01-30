import { Get, Post, Put, Delete, Controller, Param, Body, Req, Query } from '@nestjs/common';
import { LeadersService } from './leaders.service';

@Controller('leaders')
export class LeadersController {
    constructor(private readonly leadersService: LeadersService){}

    @Get()
    async getAllUsers(@Query('limit') limit: number, @Query('page') page: number, @Req() req: any){
        return this.leadersService.getList(limit, page);
    }
}

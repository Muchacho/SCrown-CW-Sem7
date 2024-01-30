import { Get, Post, Put, Delete, Controller, Param, Body, Req } from '@nestjs/common';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {

    constructor(private friendsService: FriendsService) {}

    @Get()
    async getFriendsList(@Req() req) {
        let res = await this.friendsService.getFriendsList(+req.user.id);
        return res;
    }

    @Get('/:nickname')
    async getFriend(@Param('nickname') nickname: string) {
        let res = await this.friendsService.getFriend(1, nickname);
        return res;
    }
    
    @Post('/add')
    async addNewFriend(@Req() req, @Body() data){
        return await this.friendsService.addNewFriend(req.user.id, data.nickname);
    }

    @Post()
    async acceptFriendRequest(@Req() req, @Body() data){
        return await this.friendsService.acceptFriend(req.user.id, data.id);
    }

    @Delete()
    async rejectFriendRequest(@Req() req, @Body() data){
        return await this.friendsService.rejectFriendReq(req.user.id, data.id);
    }

    //fix
    @Delete('/:id')
    async deleteFriend(@Req() req, @Param('id') id: number){
        return await this.friendsService.deleteFriend(req.user.id, +id);
    }
}

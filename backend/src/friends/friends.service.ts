import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User } from 'src/users/user.model';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FriendsService {

    constructor(private prisma: PrismaService,
                private usersService: UsersService) {}

    async getFriendsList(userid: number) {
        // let data =  await this.prisma.friends.findMany({
        //     where: {
        //         userid
        //     },
        //     select: {
        //         confirm: true,
        //         users_friends_friendidTousers: {
        //             select: {
        //                 id: true,
        //                 nickname: true,
        //                 email: true,
        //                 imgpath: true
        //             }
        //         }
        //     }
        // });
        
        // let result = {
        //     friends: [],
        //     requests: []
        // };
        // for(let i = 0; i < data.length; i++){
        //     if(data[i].confirm)
        //         result.friends.push(data[i].users_friends_friendidTousers);
        //     else 
        //         result.requests.push(data[i].users_friends_friendidTousers);
        // }

        // console.log(result);

        // return result;
        let friends = await this.prisma.friends.findMany({
            where: { 
                userid, 
                confirm: true 
            },
            select: {
                users_friends_friendidTousers: {
                    select: {
                        id: true,
                        nickname: true,
                        email: true,
                        imgpath: true
                    }
                }
            }
        });
        let friendsReq = await this.prisma.friends.findMany({
            where: {
                friendid: userid,
                confirm: false
            },
            select: {
                users_friends_useridTousers:{
                    select: {
                        id: true,
                        nickname: true,
                        imgpath: true
                    }
                }
            }
            
        });
        return {
            friends: friends.map((item) => {return item.users_friends_friendidTousers}),
            requests: friendsReq.map((item) => {return item.users_friends_useridTousers}),
        };

    }

    async getFriend(id: number, nickname: string){
        let data = await this.usersService.getBasikInfo({nickname});
       return data;
    }

    async addNewFriend(userid: number, nickname: string){
        const user = await this.usersService.getUser({nickname});
        if(user){
            await this.prisma.friends.create({
                data: {
                    userid,
                    friendid: user.id
                }
            })
        }
        return user;
    }

    async acceptFriend(userid: number, friendid: number){
        await this.prisma.friends.create({
            data: {
                userid,
                friendid,
                confirm: true
            }
        });
        let data = await this.prisma.friends.findFirst({
            where: {
                userid: friendid,
                friendid: userid,
                confirm: false
            }
        })
        await this.prisma.friends.update({
            where:{
                id: data.id
            }, 
            data: {
                confirm: true
            }
        })
        return;
    }

    async deleteFriend(userid: number, friendid: number){
        const friendListIdLeft = await this.prisma.friends.findFirst({
            where: {
                userid, friendid, confirm: true
            }
        });
        const friendListIdRight = await this.prisma.friends.findFirst({
            where: {
                userid: friendid,
                friendid: userid,
                confirm: true
            }
        });
        let x = null;
        if(friendListIdLeft){
            x = await this.prisma.friends.delete({
                where: {
                    id: friendListIdLeft.id
                }
            });
            x = await this.prisma.friends.delete({
                where: {
                    id: friendListIdRight.id
                }
            });
        }
        return x;
    }

    async rejectFriendReq(userid: number, friendid: number){
        const friendListId = await this.prisma.friends.findFirst({
            where: {
                userid: friendid,
                friendid: userid,
                confirm: false
            }
        });
        let x = null;
        if(friendListId){
            x = await this.prisma.friends.delete({
                where: {
                    id: friendListId.id
                }
            });
        }
        return x;
    }

    


    async inviteFriend() {
        return ;
    }
}


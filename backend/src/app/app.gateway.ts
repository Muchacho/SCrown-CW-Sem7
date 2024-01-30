import { OnModuleInit } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from "socket.io";
import { PrismaService } from 'src/prisma.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})


export class AppGateway implements OnModuleInit{

  constructor(private prismaServie: PrismaService) {}

  params: number;

  handleConnection(socket:any, ...args: any[]){
    this.params = socket.handshake.query.userId;
    socket.data = {
      id: socket.handshake.query.userId,
      nickname: socket.handshake.query.nickname
    }
  }

  @WebSocketServer()
  server: Server;

  onModuleInit(){
    this.server.on('connection', (socket)=>{
      socket.join(`UserRoom-${this.params}`);
    })
  }

  @SubscribeMessage('messageGlob')
  handleMessage(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
    console.log('messEvent: ' + Date.now());
    this.server.emit('message', {
      msg:"new message",
      content: body,
      nickname: socket.data.nickname
    })    
  }

  // @SubscribeMessage('roomMessage')
  // handleRoomMessage(@MessageBody() body: any){
  //   console.log('room message');
  // }


  @SubscribeMessage('inviteMessage')
  handleInviteMessage(@MessageBody() body: any,  @ConnectedSocket() socket: Socket){
    console.log('inviteEvent: ' + Date.now());
    if(socket.data.group && socket.data.group.includes('GroupRoom-')){
      console.log('include');
    } else {
      console.log('create group')
      socket.join(`GroupRoom-${body.socketID}`);
      socket.data.group = `GroupRoom-${body.socketID}`;
    }
    this.server.to(`UserRoom-${body.id}`).emit("invite", {
      content: body.socketID
    }); 
  }

  @SubscribeMessage('acceptInviteMessage')
  handleAcceptInviteMessage(@MessageBody() body: any,  @ConnectedSocket() socket: Socket){
    console.log('acceptInviteEvent: ' + Date.now());
    socket.join(`GroupRoom-${body.id}`);
    socket.data.group = `GroupRoom-${body.id}`;
    let players = this.getPlayers(socket.data.group);
    this.server.to(`GroupRoom-${body.id}`).emit('groupMessageCon', {
      content: `User ${body.socketID} is connected`,
      userData: {id: socket.data.id, nickname: socket.data.nickname},
      groupData: {
        groupName: socket.data.group,
        players
      }
    })


    
    // this.server.to(`GroupRoom-${body.id}`).emit('players', {
    //   players
    // })
    // this.server.to(`GroupRoom-${body.id}`).emit('player', {
    //   content: `User ${body.socketID} is connected`
    // })
  }

  @SubscribeMessage('getPlayers')
  handleGetPlayers(@MessageBody() body: any,  @ConnectedSocket() socket: Socket){
    let players = this.getPlayers(socket.data.group);
    this.server.to(socket.data.group).emit('players', {
      players
    })
  }


  @SubscribeMessage('canvasData')
  handleCanvasData(@MessageBody() body: any, @ConnectedSocket() socket: Socket){
    this.server.to(socket.data.group).emit('updCanvas', {
      newContext: body.data
    })
  }

  @SubscribeMessage('groupMessageSend')
  handleGroupMessageSend(@MessageBody() body: any, @ConnectedSocket() socket: Socket){
    console.log('groupMessEvent: ' + Date.now());
    console.log(socket.data);
    let players = this.getPlayers(socket.data.group);
    this.server.to(socket.data.group).emit('groupMessage', {
      content: body.message,
      nickname: socket.data.nickname,
      groupData: {
        groupName: socket.data.group,
        players
      }
    })
  }

  @SubscribeMessage('startGame')
  handleStartGame(@ConnectedSocket() socket: Socket){
    this.server.to(socket.data.group).emit('toGameStart');
    console.log('start button pressed');
    // let x = await this.prismaServie.users.findFirst({where: { id: 16}})
    // console.log(x);
  }

  @SubscribeMessage('getTheme')
  handleGetTheme(@ConnectedSocket() socket: Socket){
    if(socket.data.theme && socket.data.theme != null && socket.data.theme != '') return;
    let themes = process.env.DICTIONARY.split(', ');
    let theme = themes[Math.floor(Math.random() * (themes.length + 1))];
    console.log(theme);
    let players = this.getPlayersIdFromRoomList(socket.data.group);
    for(let i = 0; i < players.length; i++){
      this.server.sockets.sockets.get(players[i]).data.theme = theme;
    }
    this.server.to(socket.data.group).emit('setTheme', {
      theme
    });
  }



  // game
  @SubscribeMessage('readyToStart')
  handleReadyToStart(@ConnectedSocket() socket: Socket){
    socket.data.isReady = true;
    let players = this.getPlayersIdFromRoomList(socket.data.group);
    for(let item in players){
      if(!this.server.sockets.sockets.get(players[item]).data.isReady)
        return;
    }
    let themes = process.env.DICTIONARY.split(', ');
    let theme = themes[Math.floor(Math.random() * (themes.length + 1))];
    console.log(theme);
    this.server.to(socket.data.group).emit('startGame', {
      theme
    })
  }   

  @SubscribeMessage('saveImg')
  handleSaveImg(@MessageBody() body: any, @ConnectedSocket() socket: Socket){
    console.log('save');
    socket.data.img = body.img;
    let players = this.getPlayersIdFromRoomList(socket.data.group);
    for(let item in players){
      if(!this.server.sockets.sockets.get(players[item]).data.img)
        return;
    }
    this.server.to(socket.data.group).emit('readyToSendImg')
  }

  @SubscribeMessage('getImg')
  handleGetImg(@ConnectedSocket() socket: Socket){
    console.log('get mess handle: ' + Date.now());
    let players = this.getPlayersIdFromRoomList(socket.data.group);
    let player;
    let imgs = [];
    for(let item in players){
      player = this.server.sockets.sockets.get(players[item]);
      imgs.push({img:player.data.img, nickname: player.data.nickname, socketID: players[item]});
      // if(!player.data.isImgSend && !player.data.rating){
      //   this.server.sockets.sockets.get(players[item]).data.rating = 1;
      //   console.log('send img by user:' + player.data.nickname);
      //   this.server.to(socket.data.group).emit('setImg', {
      //     img: player.data.img,
      //     nickname: player.data.nickname,
      //     userid: players[item]
      //   });
      //   return;
      // }
    }
    this.server.to(socket.data.group).emit('setImg', {
      imgs
    })
  }


  @SubscribeMessage('setRating')
  handleSetRaring(@MessageBody() body: any, @ConnectedSocket() socket: Socket){
    if(this.server.sockets.sockets.get(body.socketID).data.rating) 
      this.server.sockets.sockets.get(body.socketID).data.rating += 1;
    else
      this.server.sockets.sockets.get(body.socketID).data.rating = 1;
    // console.log(this.server.sockets.sockets.get(body.socketID).data.rating)
  }
  
  @SubscribeMessage('imgChecked')
  handleImgChecked(@MessageBody() body: any, @ConnectedSocket() socket: Socket){
    // console.log('imgChecked: ' + body.authorId);
    this.server.sockets.sockets.get(body.authorId).data.isImgSend = true;
    console.log(this.server.sockets.sockets.get(body.authorId).data);
    // this.server.to(socket.data.group).emit('');
  }

  @SubscribeMessage('getWinner')
  async handleGetWinner(@ConnectedSocket() socket: Socket){
    let players = this.getPlayers(socket.data.group);
    let winner = players[0];
    console.log('winner: ' + winner.nickname);
    for(let item in players){
      if(
        (winner.rating && players[item].rating && winner.rating < players[item].rating) ||
        (!winner.rating && players[item].rating)
        ){
        console.log('set new winner: ' + players[item].nickname);
        winner = players[item]
      }
    }
    this.server.to(socket.data.group).emit('setWinner', {
      winner
    })

    //костыль
    let pl = await this.prismaServie.users.findFirst({
      where: {
        id: +socket.data.id
      }
    })
    if(socket.data.id == winner.id){
      await this.prismaServie.users.update({
        where: {
          id: pl.id
        }, 
        data: {
          score: pl.score + 100,
          countofwin: pl.countofwin + 1
        }
      })
    } else {
      await this.prismaServie.users.update({
        where: { 
          id: pl.id
        },
        data: {
          countoflose: pl.countoflose + 1
        }
      })

      //запись в историю игр
    }
  }

  @SubscribeMessage('setHistory')
  async handleSetHistory(@ConnectedSocket() socket: Socket){
    let game = await this.prismaServie.game.create({
      data: {
        winner: +socket.data.id,
        gamedate: this.formatDate(Date.now())
      }
    })
    let players = this.getPlayers(socket.data.group);
    for(let item in players){
      await this.prismaServie.history.create({
        data: {
          gameid: game.id,
          userid: +players[item].id
        }
      })
    }
  }

  @SubscribeMessage('endGame')
  handleEndGame(@ConnectedSocket() socket: Socket){

    delete socket.data.img;
    delete socket.data.isReady;
    delete socket.data.rating;
  }

  @SubscribeMessage('leaveGroup')
  handleLeaveGroup(@ConnectedSocket() socket: Socket){
    let players = this.getPlayers(socket.data.group);
    this.server.to(socket.data.group).emit('groupMessage',{
      content: `User ${socket.data.nickname} leave the group`,
      nickname: socket.data.nickname,
      groupData: {
        groupName: socket.data.group,
        players
      }
    });
    socket.leave(socket.data.group);
    delete socket.data.group;

  }

  getPlayers = (group) => {
    let players = [...this.server.sockets.adapter.rooms.get(group)].map((item) => {
      return this.server.sockets.sockets.get(item).data;
    })
    return players
  }

  getPlayersIdFromRoomList = (group) => {
    return [...this.server.sockets.adapter.rooms.get(group)];
  }

  formatDate = (timestamp) => {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
  }
}

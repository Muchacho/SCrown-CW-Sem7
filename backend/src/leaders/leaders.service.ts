import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class LeadersService {
    constructor(private prisma: PrismaService){ }

    async getList(limit = 10, page = 0){
        let leadersList = await this.prisma.users.findMany({
            orderBy: {
                score: "desc",
            },
            select: {
                id: true,
                nickname: true,
                score: true,
                countoflose: true,
                countofwin: true
            },
            skip: page * limit,
            take: +limit
        })
        return leadersList;
    }

}

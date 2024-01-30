import {atom} from 'recoil';
import { Socket, io } from 'socket.io-client';

const initstate = io();

export const wsConnState = atom<Socket>({
    key: 'wsConnState',
    default: initstate,
    dangerouslyAllowMutability: true
})
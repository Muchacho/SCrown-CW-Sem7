import React, { useEffect, useReducer, useRef, useState } from 'react'
import { CustomInput } from '../CustomInput'
import axios from 'axios';
import io from "socket.io-client";
import { Socket } from 'socket.io-client/debug';
import { useDispatch, useSelector } from 'react-redux';

import {useRecoilState, useSetRecoilState} from 'recoil';
import { wsConnState } from '../../store/atoms/wsatom';
import { groupState } from '../../store/atoms/groupAtom';

export const GroupChat = () => {

    const socket = useRecoilState(wsConnState)[0];

    const [messages, setMessages] = useState(['message']);
    const [message, setMessage] = useState('');
    // const [socket, setSocket] = useState<Socket>(wsConn[0]);
    const user = useSelector((state) => state.user.user);

    const messContainerRef = useRef(null);

    const group = useRecoilState(groupState);

    const setGroup = useSetRecoilState(groupState);
    

    useEffect(() => {
        socket?.on('groupMessage', (data)=>{
            setGroup((group) => {group = data.groupData;});
            console.log(group);
            console.log(data.groupData);
            setMessages(messages => [...messages, `${data.nickname}: ${data.content}`]);
            console.log('new message: ' + data.content);
        });
        socket?.on('groupMessageCon', (data)=>{
            setGroup(data.groupData);

            console.log(group);
            console.log(data.groupData);
            setMessages(messages => [...messages, data.content]);
        });
    }, [socket]);

    useEffect(()=>{
        messContainerRef.current.scrollTop = messContainerRef.current.scrollHeight;
    }, [messages]);

    const sendMessage = async () =>{
        console.log(Date.now())
        socket.emit('groupMessageSend', {
            id: user.id,
            socketID: socket.id,
            message
        });
    }

    

  return (
    <div className='chat-container'>
        <h3>Group Chat</h3>
        <ul className='chat'>
            <div ref={messContainerRef} style={{overflowY: "auto", height: "200px"}}>
                {messages.map(data => (<li key={Math.random()} className='message'>{data}</li>))}
            </div>
        </ul><br/>
        <div className='send-mess-block'>
            <input type='text' placeholder='message' onChange={(e)=>{setMessage(e.target.value)}}/>
            <button onClick={sendMessage}>Send</button>
        </div>
    </div>
  )
}

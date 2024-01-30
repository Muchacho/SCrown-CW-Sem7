import React, { useEffect, useRef, useState } from 'react'
import { CustomInput } from '../CustomInput'
import axios from 'axios';
import io from "socket.io-client";
import { Socket } from 'socket.io-client/debug';
import { useDispatch, useSelector } from 'react-redux';

import {useRecoilState} from 'recoil';
import { wsConnState } from '../../store/atoms/wsatom';

export const Chat = () => {

    const wsConn = useRecoilState(wsConnState);

    const [messages, setMessages] = useState(['message']);
    const [message, setMessage] = useState('');
    const [socket, setSocket] = useState<Socket>(wsConn[0]);
    const [invite, setInvite] = useState('');
    const user = useSelector((state) => state.user.user);
    const messContainerRef = useRef(null);
    

    useEffect(() => {
        socket?.on('message', (data)=>{
            setMessages(messages => [...messages, `${data.nickname}: ${data.content}`]);
        });
    }, [socket]);

    useEffect(()=>{
        messContainerRef.current.scrollTop = messContainerRef.current.scrollHeight;
    }, [messages]);

    const sendMessage = async () =>{
        // socket.send(message);
        socket.emit('messageGlob',message);
    }

    const sendMessageRoom = async () =>{
        socket.emit('roomMessage', {
            text: message,
            id: `${socket.id}${Math.random()}`,
            socketID: socket.id,
        });
        setMessages(messages => [...messages, message]);
    }
    
    const sendInviteMessage = async () =>{
        socket.emit('inviteMessage', {
            id: invite,
            socketID: socket.id,
        });
    }


  return (
    <div className='chat-container'>
        <h3>Global Chat</h3>
        <ul className='chat'>
            <div ref={messContainerRef} style={{overflowY: "auto", height: "200px"}}>
                {messages.map(data => (<li key={data} className='message'>{data}</li>))}
            </div>
        </ul>
        <div className='send-mess-block'>
            <input type='text' placeholder='message' onChange={(e)=>{setMessage(e.target.value)}}/>
            <button onClick={sendMessage}>Send</button>
        </div>
    </div>
  )
}

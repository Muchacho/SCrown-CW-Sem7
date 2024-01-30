import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { doRequest } from "../../services/createRequest";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { io } from "socket.io-client";

import {useSetRecoilState, useRecoilState} from 'recoil';
import {wsConnState} from '../../store/atoms/wsatom'


export const LoginPage = () => {
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('qweqwe');
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const setWsConn = useSetRecoilState(wsConnState);
    const socket = useRecoilState(wsConnState)[0];

    const Login = async () => {
        if(nickname.length < 4) {
            alert('Nickname cannot be shorter than 4 characters');
            // return;
        } else if(password.length < 6) {
            alert('Password cannot be shorter than 6 characters');
            return;
        } 
        const res = await axios.post(`http://localhost:9000/auth/login`, {nickname, password});
        if(res.data.statuscode){
            alert(res.data.message);
            return;
        }
        dispatch({
            type: 'SAVE_USER',
            payload: {
                id: res.data.id,
                email: res.data.email,
                nickname: res.data.nickname,
                imgPath: res.data.imgPath,
                token: res.data.token,
                role: res.data.role,
                enterTime: Date().toLocaleString()
            }
        });
        setWsConn(() => {
            return io('http://localhost:9000', {
                query: {
                    userId: res.data.id,
                    nickname: res.data.nickname
                }
            })
        })    
        navigate('/');
    }

    return (
        <div className="login-container">
            <h3>Login</h3>
            <input type="text" placeholder="Nickname" value={nickname} onChange={e => setNickname(e.target.value)}/>
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
            <button className='common-button' onClick={Login}>Send</button>

            <Link to="/registration">Register</Link>
        </div>
    )
}
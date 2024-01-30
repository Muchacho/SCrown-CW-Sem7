import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from "recoil";
import { wsConnState } from "../../store/atoms/wsatom";
import { io } from "socket.io-client";

export const RegistrationPage = () => {

    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const setWsConn = useSetRecoilState(wsConnState);
    const socket = useRecoilState(wsConnState)[0];

    const Registration = async () => {
        const emailRegex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        console.log(emailRegex.test(email));
        if(nickname.length < 4) {
            alert('Nickname cannot be shorter than 4 characters');
            return;
        } else if(password.length < 6) {
            alert('Password cannot be shorter than 6 characters');
            return;
        } else if(!emailRegex.test(email)){
            alert('Wrong email');
            return;
        }
        const res = await axios.post(`http://localhost:9000/auth/registration`, {nickname, email, password})
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
            <h3>Registration</h3>
            <input type="text" placeholder="Nickname" value={nickname} onChange={e => setNickname(e.target.value)}/>
            <input type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/>
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
            <button  className='common-button' onClick={Registration}>Send</button>
            <Link to="/login">Login</Link>
        </div>
    )
}
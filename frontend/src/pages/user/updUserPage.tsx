import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { doRequest } from "../../services/createRequest";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { io } from "socket.io-client";

import {useSetRecoilState, useRecoilState} from 'recoil';
import {wsConnState} from '../../store/atoms/wsatom'


export const UpdUser = () => {
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const setWsConn = useSetRecoilState(wsConnState);
    const socket = useRecoilState(wsConnState)[0];

    const updUser = async () => {
        if(nickname.length < 4) {
            alert('Nickname cannot be shorter than 4 characters');
            return;
        } else if(password != confirmPassword) {
            console.log('no pass')
            alert('Password cannot be shorter than 6 characters');
            return;
        } 
        // if(password != confirmPassword)return;
        await axios.put(`http://localhost:9000/users/`, {nickname, password}, {headers: {
            Authorization: 'Bearer ' + user.token,
        }});
        navigate('/user');
    }

    return (
        <div className="login-container">
            <button onClick={()=>{navigate('/clientslist')}}>qwe</button>
            <h3>Change user data</h3>
            <input type="text" placeholder="Nickname" value={nickname} onChange={e => setNickname(e.target.value)}/>
            <input type="password" placeholder="New password" value={password} onChange={e => setPassword(e.target.value)}/>
            <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}/>
            <button className='common-button' onClick={updUser}>Update</button>

            <Link to="/user">Cancel</Link>
        </div>
    )
}
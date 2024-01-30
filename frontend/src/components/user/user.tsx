import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { wsConnState } from '../../store/atoms/wsatom';

interface User {
    id?: number;
    nickname: string;
    email: string;
    score: number;
    countoflose: number;
    countofwin: number;
}

const User = (props: User) =>{

    const [historyStyle, setHistoryStyle] = useState('history-container');
    const [history, setHistory] = useState([]);


    const user = useSelector((state) => state.user.user);
    const socket = useRecoilState(wsConnState)[0];
    const navigate = useNavigate();
    const deleteFriend = () => {
        axios.delete(`http://localhost:9000/friends/${props.value.id}`, {headers: {
            Authorization: 'Bearer ' + user.token,
        }});
        navigate('/friends');
    }

    const invite = (id) => {
        console.log(id);
        socket.emit('inviteMessage', {
            id,
            socketID: user.id,
        });
        navigate('/group')
    }


    const getHistory = async () => {
        let res = await axios.get(`http://localhost:9000/users/history/${props.value.id}`, {headers: {
            Authorization: 'Bearer ' + user.token,
        }});
        console.log(res.data);
        setHistory(res.data);
        setHistoryStyle('history-container-show');
    }

    const getHistoryList = () => {
        return(
            <table>
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Game Date</th>
                        <th>Winner</th>
                    </tr>
                </thead>
                {
                    history.length ? history.map((item, index)=>
                            <tr className={props.value.id == item.winnerId ? 'history-item-win' : 'history-item-lose'}>
                                <td>{index+1}</td>
                                <td>{item.gamedate}</td>
                                <td>{item.winner}</td>
                            </tr>
                    ) : <h3>No data</h3>
                }
            </table>
        )
    }

    const closeHistory = () => {
        setHistoryStyle('history-container');
    }


    return (
        <div className='user-container'>
            <div className='user-container-data'>
                <p>Id: {props.value.id}</p>
                <p>Nickname: {props.value.nickname}</p>
                <p>Email: {props.value.email}</p>
                <p>Score: {props.value.score}   Count of win: {props.value.countofwin}    Count of lose: {props.value.countoflose}</p>
                <button className='common-button' onClick={deleteFriend}>Delete</button>
                <button className='common-button' onClick={getHistory}>History</button>
                <button className='common-button' onClick={()=>invite(props.value.id)}>Invite friend to group</button>
            </div>
            <div className='user-container-img'>
                <img className='avatar-large' src='avatar5.png'/>
            </div>
            <div className={historyStyle}>
                    <div style={{gridRow: 1}}>
                        <img onClick={closeHistory} style={{width: '20px', height: '20px', marginTop: '10px', marginRight:'15px', cursor: 'pointer', position:'absolute', right: '0%'}} src='../../../public/close.png'/>
                        <h4>History</h4>
                    </div>
                    <div style={{gridRow: 2}}>
                        <div className='history-container-data'>
                            {getHistoryList()}
                        </div>
                    </div>
                </div>
        </div>
    );
};

export default User;
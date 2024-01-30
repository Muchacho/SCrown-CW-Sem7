import React, { useEffect, useState } from 'react'
import User from '../../components/user/user';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Layout } from '../../components/layout/Layout';
import useReq from '../../services/hooks/useReq';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { wsConnState } from '../../store/atoms/wsatom';
import { Loading } from '../../components/Loading';

const UserPage = () => {

    const navigate = useNavigate();
    let {list, loading} = useReq('users/profile');
    const user = useSelector((state) => state.user.user);  
    const dispatch = useDispatch();
    const [historyStyle, setHistoryStyle] = useState('history-container')
    const socket = useRecoilState(wsConnState)[0];
    const [history, setHistory] = useState([]);

    const logout = () => {
        dispatch({type: "LOG_OUT"});
        socket.disconnect();
        navigate('/');
    }

    useEffect(()=>{
        console.log(history);
    }, [history]);

    const getWinrate = () => {
        if(list.countofwin + list.countoflose <= 0)
            return 'User dont play any game';
        else if(list.countoflose + list.countofwin != 0)
            return Math.ceil((list.countofwin / (list.countoflose + list.countofwin))*100) + '%';
        else return '0%'
    }

    const getHistory = async () => {
        let res = await axios.get(`http://localhost:9000/users/history/${user.id}`, {headers: {
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
                    history.map((item, index)=>
                            <tr className={user.id == item.winnerId ? 'history-item-win' : 'history-item-lose'}>
                                <td>{index+1}</td>
                                <td>{item.gamedate}</td>
                                <td>{item.winner}</td>
                            </tr>
                    )
                }
            </table>
        )
    }

    const closeHistory = () => {
        setHistoryStyle('history-container');
    }

    const updUser = () => {
        navigate('/updateUser')
    }

    const showUserInfo = () => {
        return (
            <div className='profile-container'>
                <div className='profile-container-data'>
                    <p>Id: {list.id} </p>
                    <p>Nickname: {list.nickname}</p>
                    <p>Email: {list.email}</p>
                    <p>Score: {list.score}</p>
                    <p>Winrate: {getWinrate()}</p>
                    <button  className='common-button' onClick={logout}>Log Out</button>
                    <button  className='common-button' style={{marginLeft: '25px'}} onClick={getHistory}>History</button>
                    <button  className='common-button' style={{marginLeft: '25px'}} onClick={updUser}>Update</button>
                </div>
                <div className='profile-container-img'>
                    <img className='profile-img' src='avatar5.png'/>
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
    }

    return (
        <Layout>
            {
                loading ? <Loading/> : showUserInfo()
            }
        </Layout>
    );
}

export default UserPage;
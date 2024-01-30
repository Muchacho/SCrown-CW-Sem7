import { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { useSelector } from 'react-redux';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { wsConnState } from '../../store/atoms/wsatom';
import { groupState } from '../../store/atoms/groupAtom';
import { ModalWindow } from '../../components/modal/modalWindow';
import useReq from '../../services/hooks/useReq';
import { GroupChat } from '../../components/chat/GroupChat';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../../components/Loading';


const GroupPage = () => {    

    const user = useSelector((state) => state.user.user);
    const navigate = useNavigate();

    const {list, loading} = useReq('friends');

    const socket = useRecoilState(wsConnState)[0];

    const [userid, setUserId] = useState('');

    const [players, setPlayers] = useState([user]);

    const [styleFriendsList, setStyleFriendsList] = useState('invite-friends-list');

    useEffect(() => {
        socket.on('players', (data)=>{
            console.log('get players');
            setPlayers(data.players);
        });
        socket.on('toGameStart', (data)=>{
            console.log('start game');
            navigate('/game');
        })
        socket.emit('getPlayers');

        socket?.on('groupMessageCon', (data)=>{
            socket.emit('getPlayers');
        });
    },[]);

    useEffect(()=>{
        console.log('upd pkayesrs')
        console.log(players);
    }, [players])

    const inviteFriend = async (id) => {
        
        console.log('invite ' + id);
        socket.emit('inviteMessage', {
            id,
            socketID: user.id,
        });
        setPlayers(data.players);
    }

    const showFriendsList = () => {
        console.log(list);
        if(styleFriendsList == 'invite-friends-list')
            setStyleFriendsList('invite-friends-list-show')
        else 
            setStyleFriendsList('invite-friends-list');
    }

    const startGame = () => {
        socket.emit('startGame');
        console.log('start button pressed');
    }

    const leaveGroup = () => {
        socket.emit('leaveGroup');
    }

    return (
        <Layout>
            <div className='group-container'>
                <div style={{gridRow:1, borderBottom: '1px solid white'}}>
                    <h3>Group</h3>
                </div>
                <ModalWindow children={undefined}></ModalWindow>
                <div className='group-data-container'>
                    <div className='group-users-list'>
                        <div style={{gridRow: 1}}>
                            <h3>Players</h3>
                            <ul>
                                {
                                    players.length == 0 ? <Loading/> :
                                        players.map((item) => {
                                            return <li key={item.id}>{item.nickname}</li>
                                        })
                                }
                            </ul>
                        </div>
                        <div style={{gridRow: 2}}>
                            {/* <input type='text' value={userid} placeholder='userid' onChange={(e) => setUserId(e.target.value)}/> */}
                            <button onClick={showFriendsList}>Invite friends</button>
                        </div>
                    </div>
                    <div className='group-chat-container'>
                        <GroupChat/>
                        <div className='group-start-container'>
                            <button onClick={leaveGroup}>Leave</button>
                            <button onClick={startGame}>Start</button>
                        </div>
                    </div>
                    <div className={styleFriendsList}>
                        <img onClick={showFriendsList} style={{width: '20px', height: '20px', marginTop: '10px', marginRight:'15px', cursor: 'pointer', position:'absolute', right: '0%'}} src='../../../public/close.png'/>
                        <h3 style={{borderBottom:'1px solid white'}}>Friends </h3>
                        <div>
                            {
                                loading ? <Loading/> : list.friends.map(item =>
                                    <li key={item.id} className='invite-friends-list-item'>{item.nickname}<button className='common-button' onClick={()=>inviteFriend(item.id)}>Send invite</button></li>
                                )
                            }
                        </div>
                    </div>
                </div>
                {/* <button onClick={getqwe}> get players</button> */}
            </div>
        </Layout>
    );

};

export default GroupPage;
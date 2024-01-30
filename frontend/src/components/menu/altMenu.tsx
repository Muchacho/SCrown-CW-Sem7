import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { wsConnState } from '../../store/atoms/wsatom';
import { useRecoilState } from 'recoil';
import { Socket } from 'socket.io-client';

const AltMenu = () =>{

    const navigate = useNavigate();
    const [section, setSection] = useState('start');
    const [inviteStyle, setInviteStyle] = useState('invite-window-hide');
    const user = useSelector((state) => state.user.user);  
    const socket = useRecoilState(wsConnState)[0];
    const [friend, setFriend] = useState(null);
    
    useEffect(()=> {
        if(user.id == null) navigate('/login');
        if(socket.connected){
            for(let i = 0; i < Object.keys(socket._callbacks).length; i++){
                if(Object.keys(socket._callbacks)[i] == '$invite'){
                    return;
                }
            }
            socket?.on('invite', (data) => {
                setFriend(data.content);
                console.log('invite');
                setInviteStyle('invite-window');
            });
        } else {
            socket.on('connect', () => {
                socket?.on('invite', (data) => {
                    console.log('invite');
                    setFriend(data.content);
                    setInviteStyle('invite-window');
    
                });
            })
        }
        return() => {
            socket.removeAllListeners('invite');
        }
    }, [])

    // useEffect(() => {
    //     console.log(socket._callbacks);
    // }, [a])

    const UserButton = () => {
        if(Object.keys(user).length != 0 && (!user.token || user.token == null))
            return <Link to="/login">Log in</Link>;
        else 
            return <Link to='/user'><img className='avatar' src='avatar5.png'/></Link>
    }
 
    

    // const setStyle = () => {

    // }

    const goToMain = () => {
        navigate('/');
    }

    const acceptInvite = () => {
        console.log('invite accetp in ' + Date.now());
        socket.emit('acceptInviteMessage', {
            id: friend,
            socketID: user.id,
        });
        setInviteStyle('invite-window-hide');
        navigate('/group');
    }

    const closeWindow = () => {
        setInviteStyle('invite-window-hide');
    }

    const genMenu = () => {
        if(user.role == 'client'){
            return (
                <header className="menu-container">
                    <h3 style={{gridColumn: 1}} className='menu-item' onClick={goToMain}>SCrown</h3>
                    {/* <h3 style={{gridColumn: 2}} className='menu-item' onClick={() => {
                        navigate('/game')
                    }}>Start</h3> */}
                    <h3 style={{gridColumn: 2}} className='menu-item' onClick={() => {
                        navigate('/friends')
                    }}>Friends</h3>
                    <h3 style={{gridColumn: 3}} className='menu-item' onClick={() => {
                        navigate('/group')
                    }}>Group</h3>
                    <h3 style={{gridColumn: 4}} className='menu-item' onClick={() => {
                        navigate('/leaders')
                    }}>Leaders</h3>
                    <h3 style={{gridColumn: 5}} className='menu-item' onClick={() => {
                        navigate('/about')
                    }}>How to play?</h3>
                    <p style={{gridColumn: 6}}></p>
                    <h3 style={{gridColumn: 7}}>{UserButton()}</h3>
                </header>
            )
        } else {
            return (
                <header className="menu-container">
                    <h3 style={{gridColumn: 1}} className='menu-item' onClick={goToMain}>SCrown</h3>
                    {/* <h3 style={{gridColumn: 2}} className='menu-item' onClick={() => {
                        navigate('/game')
                    }}>Start</h3> */}
                    <h3 style={{gridColumn: 2}} className='menu-item' onClick={() => {
                        navigate('/friends')
                    }}>Friends</h3>
                    <h3 style={{gridColumn: 3}} className='menu-item' onClick={() => {
                        navigate('/group')
                    }}>Group</h3>
                    <h3 style={{gridColumn: 4}} className='menu-item' onClick={() => {
                        navigate('/leaders')
                    }}>Leaders</h3>
                    <h3 style={{gridColumn: 5}} className='menu-item' onClick={() => {
                        navigate('/clientslist')
                    }}>Clients</h3>
                    <p style={{gridColumn: 6}}></p>
                    <h3 style={{gridColumn: 7}}>{UserButton()}</h3>
                </header>
            )
        }
    }


    return (
        <div>
            {genMenu()}
            {/* <header className="menu-container">
                <h3 style={{gridColumn: 1}} className='menu-item' onClick={goToMain}>SCrown</h3>
                <h3 style={{gridColumn: 2}} className='menu-item' onClick={() => {
                    navigate('/friends')
                }}>Friends</h3>
                <h3 style={{gridColumn: 3}} className='menu-item' onClick={() => {
                    navigate('/group')
                }}>Group</h3>
                <h3 style={{gridColumn: 4}} className='menu-item' onClick={() => {
                    navigate('/leaders')
                }}>Leaders</h3>
                <h3 style={{gridColumn: 5}} className='menu-item' onClick={() => {
                    navigate('/about')
                }}>How to play?</h3>
                <p style={{gridColumn: 6}}></p>
                <h3 style={{gridColumn: 7}}>{UserButton()}</h3>
            </header> */}
            <div className={inviteStyle}>
                <p>Invite group</p>
                <div className='invite-window-item'>
                    Friend {friend} invite you
                    <div>
                        <button className='common-button' style={{marginRight:'5px'}} onClick={acceptInvite}>Accept</button>
                        <button className='common-button' style={{marginRight:'5px'}} onClick={closeWindow}>Deny</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AltMenu;
                    {/* <h3 style={{gridColumn: 2}} className='menu-item' onClick={() => {
                        navigate('/game')
                    }}>Start</h3> */}
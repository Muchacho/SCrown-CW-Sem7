import React, { useEffect, useState } from 'react'
import { Layout } from '../../components/layout/Layout';
import useReq from '../../services/hooks/useReq';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import User from '../../components/user/user';
import { Loading } from '../../components/Loading';

const FriendsPage = () => {

    const {list, loading} = useReq('friends');
    const [nickname, setNickname] = useState('');
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);
    const [friend, setFriend] = useState(null);
    const [friends, setFriends] = useState([]);

    const addFriend = async () => {
        await axios.post(`http://localhost:9000/friends/add`, {nickname}, {headers: {
            Authorization: 'Bearer ' + user.token,
        }} );
        navigate('/friends');
    }

    const checkFriendProfile = async (param) => {
        const res = await axios.get(`http://localhost:9000/friends/${param}`, {headers: {
            Authorization: 'Bearer ' + user.token,
        }} );
        setFriend(res.data)
    }

    const writeUser = () =>{
        if(friend == null) return <p style={{textAlign:'center', marginTop: '100px'}}>Select friend</p>;
        else return <User value={friend}/>;
    }


    const acceptFriend = async (id: number) => {
        await axios.post(`http://localhost:9000/friends`, {id}, {headers: {
            Authorization: 'Bearer ' + user.token,
        }} );
        navigate('/friends');
    }

    const rejectFriend = async (id: number) => {
        await axios.delete(`http://localhost:9000/friends`, {
            headers: {
                Authorization: 'Bearer ' + user.token
            },
            data: {
                id
            }
        });
    }

    const setFriendNickname = (value) => {
        setNickname(value);
        let result = [];
        for(let item in list.friends) {
            if(list.friends[item].nickname.indexOf(value) >= 0){
                console.log(list.friends[item].nickname);                
                result.push(list.friends[item]);
            }
        }
        setFriends(result);
    }

    useEffect(()=>{
        if(!loading) {
            setFriends(list.friends);
            console.log('------------------')
            console.log('friends')
            console.log(friends);
            console.log('------------------')
        }
    }, [loading]);

    const showFriendsList = () => {
        return (
            <ul style={{margin: '0px'}}>
                        {
                            friends.length <= 0 ? "no friends" : friends.map(item=>
                                <li className='friends-item' key={item.id} onClick={(e) => checkFriendProfile(e.target.textContent)}>{item.nickname}</li>
                            )
                        }
            </ul>
        )
    }

    const showRequestList = () => {
        if(list.requests.length <= 0) {
            return;
        } else {
            return (
                <ul style={{margin: '0px',  padding: '0px'}}>
                    {
                        list.requests.map(item=>
                            <li className='friends-item' key={item.id}>{item.nickname} 
                                <button className='common-button' onClick={() => acceptFriend(item.id)}>
                                    ok
                                </button>
                                <button className='common-button' onClick={() => rejectFriend(item.id)}>
                                    no
                                </button>
                            </li>
                        )
                    }
                </ul>
            )
        }
    }

    return (
        <Layout>
            <div className='friends-container'>
                <div style={{gridRow: 1, borderBottom: '1px solid white'}}><h3>Friends</h3></div>
                <div className='friends-data-container'>
                    <div style={{gridColumn: 1, borderRight: '1px solid white'}}>
                        <div className='send-mess-block'>
                            <input type='text' placeholder='Input nickname...' value={nickname} onChange={(e)=>{setFriendNickname(e.target.value)}}/>
                            <button onClick={addFriend}>Add</button>
                        </div>
                        {
                            loading ? <Loading/> : showFriendsList()
                        }
                        {
                            loading ? '' : <p>Request list<hr/>{showRequestList()}</p>
                        }
                        
                    </div>
                    <div style={{gridColumn: 2}}>
                            {writeUser()}
                    </div>
                </div>
            </div>
        </Layout>
        
    );
}

export default FriendsPage;
import React, { useEffect, useState } from 'react'
import { Layout } from '../../components/layout/Layout';
import useReq from '../../services/hooks/useReq';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import User from '../../components/user/user';
import { Loading } from '../../components/Loading';
import UserConf from '../../components/user/userConf';

const ClientsPage = () => {

    const {list, loading} = useReq('users');
    const [nickname, setNickname] = useState('');
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);
    const [client, setClient] = useState(null);
    const [clients, setClients] = useState([]);

    const checkClientProfile = async (param) => {
        const res = await axios.get(`http://localhost:9000/users/client/${param}`, {headers: {
            Authorization: 'Bearer ' + user.token,
        }} );
        console.log(res.data);
        setClient(res.data)
    }

    const writeUser = () =>{
        if(client == null) return <p style={{textAlign:'center', marginTop: '100px'}}>Select client</p>;
        else return <UserConf value={client}/>;
    }

    const setClientNickname = (value) => {
        setNickname(value);
        let result = [];
        for(let item in list) {
            if(list[item].nickname.indexOf(value) >= 0){
                result.push(list[item]);
            }
        }
        setClients(result);
    }

    useEffect(()=>{
        if(!loading) {
            if(user.role != 'admin' && user.id)
            navigate('/accessError')
            setClients(list);
        }
    }, [loading]);

    const showClientsList = () => {
        return (
            <ul style={{margin: '0px'}}>
                        {
                            clients.length <= 0 ? "no clients" : clients.map(item=>
                                <li className='friends-item' key={item.id} onClick={(e) => checkClientProfile(item.id)}>{item.nickname}</li>
                            )
                        }
            </ul>
        )
    }

    return (
        <Layout>
            <div className='friends-container'>
                <div style={{gridRow: 1, borderBottom: '1px solid white'}}><h3>Clients</h3></div>
                <div className='friends-data-container'>
                    <div style={{gridColumn: 1, borderRight: '1px solid white', overflowY: 'auto', overflowX: 'hidden'}}>
                        <input className='find-friend' type='text' placeholder='Input nickname...' value={nickname} onChange={(e)=>{setClientNickname(e.target.value)}}/>
                        {
                            loading ? <Loading/> : showClientsList()
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

export default ClientsPage;
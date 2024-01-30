import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { doRequest } from '../../services/createRequest';
import { useSelector } from 'react-redux';
import useReq from '../../services/hooks/useReq';
import axios from 'axios';
import { Loading } from '../../components/Loading';

const LeadersPage = () => {

    const [leaders, setLeaders] = useState([]);
    let {list, loading} = useReq('leaders');
    const user = useSelector((state) => state.user.user);


    const getList = async (a) => {
        const res = await axios.get(`http://localhost:9000/leaders?limit=${a}`, {headers: {
            Authorization: 'Bearer ' + user.token,
        }} );
        setLeaders(res.data);
    }

    useEffect(()=>{
        setLeaders(list);
    }, [loading])

    return (
        <Layout>
            <div className='leaders-container'>
                <div className='leaders-container-head'>
                    <h4>Leaders page</h4>
                    <label>Select count of rows
                        <select name='limit' onChange={(e) => getList(e.target.value)}>
                            <option value='10'>10</option>
                            <option value='50'>50</option>
                            <option value='30'>100</option>
                        </select>
                    </label>
                </div>
                <div className='leaders-container-table'>
                    {
                        leaders.length == 0 ? 
                            <Loading/> :
                            <table>
                                <thead>
                                    <tr>
                                        <th>№</th>
                                        <th>Player</th>
                                        <th>Score</th>
                                        <th>Count of win game</th>
                                        <th>Count of lose game</th>
                                    </tr>
                                </thead>
                                    {
                                        leaders.map((item, index)=>
                                            <tr  key={item.id}>
                                                <td className='table-item'>{index+1}</td>
                                                <td className='table-item'>{item.nickname}</td>
                                                <td className='table-item'>{item.score}</td>
                                                <td className='table-item'>{item.countofwin}</td>
                                                <td className='table-item'>{item.countoflose}</td>
                                            </tr>
                                        )
                                    }
                                <tr><p></p>
                                </tr>
                            </table>
                    }
                    
                </div>
            </div>
        </Layout>
    );
}

export default LeadersPage;
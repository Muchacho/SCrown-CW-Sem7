import React, {  } from 'react'
import { Chat } from '../components/chat/Chat';
import { Layout } from '../components/layout/Layout';


const MainPage = () => {    
    return (
        <Layout>
            <div className='main-containter'>
                <Chat/>
                <div style={{ gridColumn: 2}}/>
            </div>
        </Layout>
    );

};

export default MainPage;
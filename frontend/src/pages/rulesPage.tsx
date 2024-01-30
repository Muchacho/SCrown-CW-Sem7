import { Layout } from '../components/layout/Layout';

const RulesPage = () => {    
    return (
        <Layout>
            <div className='rules-containter' style={{overflowY: 'auto'}}>
                <h3>How to play?</h3>
                <hr/>
                <p>Scrown is a web application created for you to have fun with your friends.</p>
                <h4>How to start playing?</h4>
                <p>Follow these points and you will succeed:
                    <ul>
                        <li>send a request to your friend on the tab "Friends";</li>
                        <li>after your friend accepts the request, you can invite him to the group on the tab "Group";</li>
                        <li>then, you gather your group, click the start button and have fun.</li>
                    </ul>
                </p>
                <h4>what else can you do?</h4>
                <p>There descriptions for some options for you:</p>
                    <ul>
                        <li>look at the leader table on the tab "Leaders"</li>
                        <li>You want to change password or nickname? You can do this in your profile</li>
                        <li>You want to see history of your games or your friends? You can also do this on profile or on the tab "Friends"</li>
                    </ul>
            </div>
        </Layout>
    );

};

export default RulesPage;
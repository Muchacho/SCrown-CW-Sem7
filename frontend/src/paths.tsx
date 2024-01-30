import { LoginPage } from './pages/auth/LoginPage.tsx';
import { Chat } from './components/chat/Chat.tsx';
import MainPage from './pages/MainPage.tsx';
import { RegistrationPage } from './pages/auth/RegistrationPage.tsx';
import LeadersPage from './pages/user/LeadersPage.tsx';
import AltMenu from './components/menu/altMenu.tsx';
import FriendsPage from './pages/user/friendsPage.tsx';
import RulesPage from './pages/rulesPage.tsx';
import UserPage from './pages/user/userPage.tsx';
import GroupPage from './pages/game/groupPage.tsx';
import { GamePage } from './pages/game/GamePage.tsx';
import { UpdUser } from './pages/user/updUserPage.tsx';
import ClientsPage from './pages/user/clientsListPage.tsx';
import AccessError from './pages/AccessError.tsx';

export const Paths = [
    {
        path: '/',
        element: <MainPage/>
    },
    {
        path: '/login',
        element: <LoginPage/>
    },
    {
        path: '/registration',
        element: <RegistrationPage/>
    },
    {
        path: '/user',
        element: <UserPage/>
    }, 
    {
        path: '/game',
        element: <GamePage/>
    },
    {
        path: '/friends',
        element: <FriendsPage/>
    },
    {
        path: '/group',
        element: <GroupPage/>
    },
    {
        path: '/leaders',
        element: <LeadersPage/>
    },
    // {
    //     path: '/chat',
    //     element: <AltMenu/>
    // },
    {
        path: '/about',
        element: <RulesPage/>
    },
    {
        path: '/updateUser',
        element: <UpdUser/>
    },
    {
        path: '/clientslist',
        element: <ClientsPage/>
    },
    {
        path: '/accessError',
        element: <AccessError/>
    }
];
import {atom} from 'recoil';

interface IGroup {
    groupName: string;
    players: Array<object>;
}

export const groupState = atom<IGroup>({
    key: 'groupState',
    default: {
        groupName: '',
        players: []
    },
})
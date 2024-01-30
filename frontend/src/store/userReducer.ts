const SAVE_USER = 'SAVE_USER';
const LOG_OUT = 'LOG_OUT';

const initialState = {
    user: {
        id: null,
        email: null,
        nickname: null,
        imgPath: null,
        token: null,
        role: null,
        enterTime: null
    }
}

export const userReduser = (state = initialState, action: { type: string; payload: unknown; }) => {
    switch(action.type){
        case SAVE_USER: 
            return {
                ...state, user: action.payload
            };
        case LOG_OUT: 
            return {
                user: {
                    id: null,
                    email: null,
                    nickname: null,
                    imgPath: null,
                    token: null,
                    role: null,
                    enterTime: null
                }
            };
        default: return state;
    }
}
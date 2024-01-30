import { combineReducers } from 'redux';
import { userReduser } from './userReducer';


const rootReducer = combineReducers({
    user: userReduser,
});

export default rootReducer;
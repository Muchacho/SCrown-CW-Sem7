import axios from "axios";
import { useSelector } from "react-redux";

export const doRequest = async (path: string, method: string, data: any = null) =>{
    const user = useSelector((state) => state.user.user);
    switch(method) {
        case "GET": {
            return await axios.get(`http://localhost:9000/${path}`, {headers: {
                Authorization: 'Bearer ' + user.token,
            }} );
        }
        case "POST": {
            return await axios.post(`http://localhost:9000/${path}`, data, {headers: {
                Authorization: 'Bearer ' + user.token,
            }} );
        }
        case "PUT": {
            return await axios.put(`http://localhost:9000/${path}`, data,  {headers: {
                Authorization: 'Bearer ' + user.token,
            }} );
        }
        default: return "Wrong data";
    }
}
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useReq = (url: string) => {

    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.user.user);
    
    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`http://localhost:9000/${url}`, {headers: {
                Authorization: 'Bearer ' + user.token,
            }} );
            setList(response.data);
            setLoading(false);
        }
        fetchData();
    }, [url])


    return {list, loading};
};

export default useReq;
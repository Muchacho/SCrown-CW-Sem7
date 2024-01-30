import React from 'react';
import { Link } from 'react-router-dom';
const Menu = () =>{
    return (
        <ul style={{marginRight: 0+'%', gridColumn: 3}}>
            <li><Link to="">Start</Link></li>
            <li><Link to="">Friends</Link></li>
            <li><Link to="">Group</Link></li>
            <li><Link to="/leaders">Leaders</Link></li>
        </ul>
    );
};

export default Menu;
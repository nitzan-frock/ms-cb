import React from 'react';

import Logo from './logo/logo';
import Navbar from './navbar/navbar';

import './header.scss';

const Header = (props) => {
    return (
        <div className="header">
            <Logo />
            <Navbar {...props}/>
        </div>
    );
};

export default Header;
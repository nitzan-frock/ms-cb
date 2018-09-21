import React from 'react';

import Tabs from './tabs/tabs';

import './navbar.scss';

const Navbar = (props) => {
    return (
        <div className="navbar">
            <Tabs {...props} />
        </div>
    );
};

export default Navbar;
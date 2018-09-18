import React from 'react';

import Tabs from './tabs/tabs';

import './navbar.scss';

const Navbar = (props) => {
    const tabs = ["Resources", "Machines", "Data Monitor"];
    return (
        <div className="Navbar">
            <Tabs {...props} tabs={tabs} />
        </div>
    );
};

export default Navbar;
import React from 'react';
import uuid from 'uuid/v1';

import Tab from '../../../../UI/tab/tab';

const tabs = (props) => {
    const tabs = ["Resources", "Machines", "Data Monitor"];

    return tabs.map(name => {
        const active = props.activeTab === name.toLowerCase() ? true : false;
        return (
            <Tab key={uuid()} active={active} clicked={props.tabClicked} name={name} />
        );
    });
};

export default tabs;
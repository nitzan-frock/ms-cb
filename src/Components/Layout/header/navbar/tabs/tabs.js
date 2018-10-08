import React from 'react';
import uuid from 'uuid/v1';

import Tab from '../../../../UI/tab/tab';
import StringManipulator from '../../../../../tools/stringManipulator/StringManipulator';

const tabs = (props) => {
    return props.tabs.map(tab => {
        console.log(tab);
        console.log(props.activeTab);
        const active = props.activeTab === tab ? true : false;
        return (
            <Tab 
                key={uuid()} 
                active={active} 
                clicked={props.tabClicked} 
                id={tab} 
                name={StringManipulator.toTitleCase(tab)} />
        );
    });
};

export default tabs;
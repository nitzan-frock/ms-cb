import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v1';

import Tab from '../../../../UI/tab/tab';
import StringManipulator from '../../../../../tools/stringManipulator/StringManipulator';

const tabs = (props) => {
    return props.tabs.map(tab => {
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

tabs.propTypes = {
    activeTab: PropTypes.string.isRequired,
    tabClicked: PropTypes.func.isRequired,
    tabs: PropTypes.arrayOf(PropTypes.string).isRequired
};
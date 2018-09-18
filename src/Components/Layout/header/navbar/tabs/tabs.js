import React from 'react';

import './tabs.scss';

const Tabs = (props) => {
    return props.tabs.map((name, index) => {
        const classes = ["Tab"];
        if (props.activeTab === name) {
            classes.push("Active");
        }
        return (
            <div className={classes.join(" ")} onClick={props.tabClicked(name)} key={name+index}>
                <p>{name}</p>
            </div>
        )
    })
};

export default Tabs;
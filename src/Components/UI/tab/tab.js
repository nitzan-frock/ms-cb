import React from 'react';

import './tab.scss';

const tab = (props) => {
    const classes = ["tab"];
    if (props.active) {
        classes.push("active");
    }
    return (
        <div className={classes.join(" ")} onClick={() => {props.clicked(props.id)}}>
            <p>{props.tabName}</p>
        </div>
    )
};

export default tab;
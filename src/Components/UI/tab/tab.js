import React from 'react';

import './tab.scss';

const tab = (props) => {
    const classes = ["tab"];
    if (props.active) {
        classes.push("active");
    }
    return (
        <div className={classes.join(" ")} onClick={() => {props.clicked(props.name)}}>
            <p>{props.name}</p>
        </div>
    )
};

export default tab;
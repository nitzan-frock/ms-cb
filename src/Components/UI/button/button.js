import React from 'react';

import './button.scss';

const button = (props) => {
    return (
        <div className="button" onClick={props.clicked} >{props.children}</div>
    );
};

export default button;
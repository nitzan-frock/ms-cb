import React from 'react';

import './field.scss';

const field = (props) => {
    let styleClass = ["field"];
    if (props.invalidEntry){
        styleClass.push("invalid");
    }
    return (
        <input 
            className={styleClass.join(" ")}
            type="text" 
            value={props.value} 
            onChange={props.formatInput}
            onBlur={props.formatInput}
            maxLength= {props.maxLength}
            placeholder={props.placeholder}></input>
    );
};

export default field;
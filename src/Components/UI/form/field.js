import React from 'react';

import './field.scss';

const field = (props) => {
    let styleClass = ["field"];
    if (props.invalidEntry === props.name || props.invalidEntry === "invalid"){
        styleClass.push("invalid");
    }
    return (
        <input 
            className={styleClass.join(" ")}
            type="text" 
            value={props.value} 
            onChange={props.changed}
            onBlur={props.unfocus}
            maxLength= {props.maxLength}
            placeholder={props.placeholder}></input>
    );
};

export default field;
import React from 'react';

import Selection from '../../UI/selection/selection';
import './field.scss';

const field = (props) => {
    //console.log(`[field]`);
    let field = null;
    if (props.field.type === "input") {
        let styleClass = ["input"];
        if (props.invalidEntry){
            styleClass.push("invalid");
        }
        field = (
            <input 
                className={styleClass.join(" ")}
                type="text" 
                value={props.value} 
                onChange={props.changed}
                onBlur={props.changed}
                maxLength= {props.field.maxLength}
                placeholder={props.field.placeholder}></input>
        );
    } else if (props.field.type === "select") {
        field = (
            <Selection 
                items={props.field.items}
                defaultValue={props.field.defaultValue}
                value={props.value}
                changed={props.changed}
                />
        );
    }
    
    return field;
};

export default field;
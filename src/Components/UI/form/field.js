import React from 'react';

import Selection from '../../UI/selection/selection';
import Radio from './radio';

import './field.scss';

const field = (props) => {
    //console.log(`[field]`);
    let field = null;
    switch (props.field.type) {
        case 'input':
            let styleClass = ["input"];
            if (!props.field.isValid){
                styleClass.push("invalid");
            }
            field = (
                <input 
                    className={styleClass.join(" ")}
                    type="text" 
                    value={props.field.value} 
                    onChange={props.changed}
                    onBlur={props.changed}
                    maxLength= {props.field.maxLength}
                    placeholder={props.field.placeholder}></input>
            );
            break;

        case 'select':
            field = (
                <Selection 
                    items={props.field.items}
                    defaultValue={props.field.defaultValue}
                    value={props.field.value}
                    changed={props.changed}
                    />
            );
            break;
        
        case 'radio':
            field = (
                <Radio
                    legend={props.field.legend}
                    buttons={props.field.items}
                    value={props.field.value}
                    changed={props.changed} />
            )
        default:
            break;
    }
    
    return field;
};

export default field;
import React from 'react';

const radio = (props) => {
    console.log(props);
    const radioButtons = props.buttons.map((button, index) => {
        console.log(`is ${button.value} checked? ${props.value === button.value}`);
        return (
            <div key={index}>
                <input 
                    type="radio"        
                    id={button.value} 
                    name={props.name}   
                    value={button.value} 
                    checked={props.value === button.value}
                    onChange={props.changed} ></input>
                <label htmlFor={button.value}>{button.label}</label>
            </div>
        );
    });

    return (
        <fieldset>
            <legend>
                {props.legend}
            </legend>
            {radioButtons.length ? radioButtons : null}
        </fieldset>
    );
};

export default radio;
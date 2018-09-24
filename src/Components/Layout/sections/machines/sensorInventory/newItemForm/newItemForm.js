import React from 'react';

import Button from '../../../../../UI/button/button'; 

const newItemForm = (props) => {
    let inputClass = [];
    if (props.invalid === "serial") inputClass.push("invalid");
    if (props.invalid === "mac") inputClass.push("invalid");
    return (
        <div>
            <input 
                type="text" 
                value={props.newItemSN} 
                onChange={props.newItemSNChanged}
                onBlur={props.newItemSNEntered}
                maxLength="13"
                placeholder="Serial Number"></input>
            <input 
                type="text" 
                value={props.newItemMAC} 
                onChange={props.newItemMACChanged}
                maxLength="17"
                placeholder="MAC Address"></input>
            <div>
                <Button clicked={props.submitForm} >Add Item</Button>
            </div>
        </div>
    );
};

export default newItemForm;
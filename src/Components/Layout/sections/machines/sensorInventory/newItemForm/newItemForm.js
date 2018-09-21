import React from 'react';

const newItemForm = (props) => {
    return (
        <div>
            <input 
                type="text" 
                value={props.newItemSN} 
                onChange={props.newItemSNChanged} 
                placeholder="Serial Number"></input>
            <input 
                type="text" 
                value={props.newItemMAC} 
                onChange={props.newItemMACChanged}
                maxLength="17"
                placeholder="MAC Address"></input>
            <div>
                Add Item
            </div>
        </div>
    );
};

export default newItemForm;
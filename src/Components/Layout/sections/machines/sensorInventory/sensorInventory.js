import React from 'react';
import uuid from 'uuid/v1';

import Button from '../../../../UI/button/button';

import StringManipulator from '../../../../../tools/stringManipulator/StringManipulator';
import Aux from '../../../../../tools/auxiliary';

const sensorInventory = (props) => {
    const items = ["datahubs", "sensors", "OEM"];
    const defaultValue = "Select A Product"; 

    return (
        <Aux>
            <div>
                <select 
                    defaultValue={defaultValue} 
                    value={props.selectedItem} 
                    onChange={props.selectedItemChanged}>
                    <option disabled>{defaultValue}</option>
                    {items.map(item => {
                        const itemName = StringManipulator.toTitleCase(item);
                        return (
                            <option key={uuid()} value={item}>{itemName}</option>
                        )
                    })}
                </select>
                <Button clicked={props.showModalClicked}>Add New</Button>
                <ul>
                    <li>add new sensor button</li>
                    <li>list of sensors with filter by SN, machine</li>
                </ul>
            </div>
        </Aux>
    );
};

export default sensorInventory;
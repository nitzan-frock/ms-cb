import React from 'react';

import Button from '../../../../UI/button/button';
import Selection from '../../../../UI/selection/selection';

import Aux from '../../../../../tools/auxiliary';

const sensorInventory = (props) => {
    const items = ["datahubs", "sensors", "OEM"];
    const defaultValue = "Select A Product"; 

    return (
        <Aux>
            <div>
                <Selection 
                    defaultValue={defaultValue}
                    selectedItem={props.selectedItem}
                    selectedItemChanged={props.selectedItemChanged}
                    items={items} />
                <Button clicked={props.showModalClicked}>Add New Item</Button>
                <ul>
                    <li>TODO: list of sensors with filter by SN, machine</li>
                </ul>
            </div>
        </Aux>
    );
};

export default sensorInventory;
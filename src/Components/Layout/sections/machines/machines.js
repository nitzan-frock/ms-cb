import React from 'react';

import ItemInventory from './itemInventory/ItemInventory';
import MachinesOrganizer from './machinesOrganizer/machinesOrganizer';

const machines = (props) => {
    return (
        <>
            <ItemInventory {...props}/>
            <MachinesOrganizer {...props} />
        </>
    );
};

export default machines;
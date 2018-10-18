import React from 'react';

import Card from '../../../../../../UI/card/card';

const machineCards = (props) => {
    return props.machines.map((machine, index) => {
        return (
            <Card key={index} title={machine.displayName} description={machine.description} >
                <button onClick={props.editMachine}>View/Edit Machine</button>
            </Card>
        );
    })
};

export default machineCards;
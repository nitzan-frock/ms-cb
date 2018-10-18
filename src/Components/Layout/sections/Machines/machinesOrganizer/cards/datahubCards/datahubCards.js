import React from 'react';

import Card from '../../../../../../UI/card/card';

import StringManipulator from '../../../../../../../tools/stringManipulator/StringManipulator';

const datahubCards = (props) => {
    return props.datahubs.map((datahub, index) => {
        return (
            <Card 
                key={index} 
                title={datahub.displayName ? datahub.displayName : datahub.serial} 
                description={StringManipulator.MACAddressFormatter(datahub.mac)}>
                <p>Machines: {datahub.machines.length}</p>
                <button onClick={() => props.enterDatahub(datahub)} >Enter Datahub</button>
            </Card>
        )
    })
};

export default datahubCards;
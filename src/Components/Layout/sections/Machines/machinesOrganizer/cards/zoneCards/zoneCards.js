import React from 'react';

import Card from '../../../../../../UI/card/card';

const zoneCards = (props) => {
    return props.zones.map((zone, index) => {
        return (
            <Card key={index} title={zone.displayName} description={zone.description}>
                <p>Machines: {zone.machineCount}</p>
                <button onClick={() => props.enterZone(zone)}>=></button>
            </Card>
        );
    })
};

export default zoneCards;
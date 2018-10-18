import React from 'react';

import Card from '../../../../../../UI/card/card';

const locationCards = (props) => {
    return props.locations.map((location, index) => {
        return (
            <Card key={index} title={location.displayName} description={location.description}>
                <p>Zones: {location.zoneCount}</p>
                <button onClick={() => props.showZones(location)} >Enter Location</button>
                <p>Datahubs: {location.datahubCount}</p>
                <button onClick={() => props.showDatahubs(location)} >Show Datahubs</button>
            </Card>
        );
    })
};

export default locationCards;
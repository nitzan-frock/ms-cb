import React from 'react';

import Card from '../../../../../UI/card/card';

const locationCards = (props) => {
    return props.locations.map((location, index) => {
        return (
            <Card key={index} title={location.displayName} description={location.description}>
                <p>Zones: {location.zoneCount}</p>
                <p>Datahubs: {location.datahubCount}</p>
            </Card>
        );
    })
};

export default locationCards;
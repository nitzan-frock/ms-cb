import React from 'react';

import Card from '../../../../../UI/card/card';

const locationCards = (props) => {
    return props.locations.map((location, index) => {
        return (
            <Card key={index} title={location.displayName} description={location.description}>
                <p>Zones: {location.zoneCount ? location.zoneCount : 0}</p>
                <p>Datahubs: {location.datahubCount ? location.zoneCount : 0}</p>
            </Card>
        );
    })
};

export default locationCards;
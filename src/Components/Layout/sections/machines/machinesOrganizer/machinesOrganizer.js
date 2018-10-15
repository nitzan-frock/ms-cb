import React, { Component } from 'react';

import DataTools from '../../../../../data/DataTools';
import { runInThisContext } from 'vm';

export default class MachinesOrganizer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            locations: null,
            zones: null,
            currentLocation: null,
            currentZone: null,
        };
    }

    async componentDidMount() {
        console.log(`[componentDidMount]`);
        const company_id = this.props.activeUser.companyId;
        const defaultLocation_id = this.props.activeUser.defaultLocationId;
        const locations = await DataTools.getLocations(company_id);

        if (!defaultLocation_id){
            this.setState({ loading: false, locations });
            return;
        }

        const location = (await DataTools.getLocations(company_id, defaultLocation_id))[0];
        const zones = await DataTools.getZones(company_id, location.id);

        this.setState({
            loading: false,
            currentLocation: location,
            locations,
            zones
        });
    }

    onLocationChanged = () => {

    }

    render() {
        let locationSelection;
        const locations = this.state.locations ? this.state.locations.map(location => location.displayName) : null;
        const selectLocationDefault = 'Select a Location';
        if (this.state.currentLocation) {
            locationSelection = (
                <Selection
                    defaultValue={selectedLocationDefault}
                    items={locations}
                    selectedItem={this.state.currentLocation}
                    onSelectionChanged={this.onLocationChanged}
                     />
            )
        }
        return (
            <>
                <div>MachineOrganizer: locations, zones, machines</div>
                {
                    this.state.loading 
                    ? <div>Loading...</div> : null
                }
            </>
        );
    }
};
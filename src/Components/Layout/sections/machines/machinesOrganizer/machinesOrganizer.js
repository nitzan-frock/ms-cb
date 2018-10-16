import React, { Component } from 'react';

import DataTools from '../../../../../data/DataTools';
import Selection from '../../../../UI/selection/selection';
import LocationCards from './locationCards/locationCards';

export default class MachinesOrganizer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            locations: [],
            zones: [],
            machines: [],
            datahubs: [],
            currentLocation: undefined,
            currentZone: undefined
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
        const datahubs = await DataTools.getDatahubs(company_id, location.id);

        this.setState({
            loading: false,
            currentLocation: location,
            locations,
            zones
        });
    }

    onLocationChanged = async event => {
        event.preventDefault();
        const currentLocation = this.state.locations
            .map(location => location.displayName === event.target.value ? location : null)
            .reduce((location, next) => location ? location : next);
        const zones = await DataTools.getZones(this.props.activeUser.companyId, currentLocation.id);
        this.setState({zones, currentLocation, currentZone: undefined});
    }

    onZoneChanged = async event => {
        event.preventDefault();
        const currentZone = this.state.zones
            .map(zone => zone.displayName === event.target.value ? zone : null)
            .reduce((zone, next) => zone ? zone : next);
        this.setState({currentZone})
    }

    render() {
        let locationSelection = null;
        let zoneSelection = null;

        const defaultValue_locations = 'Locations';
        const defaultValue_zones = 'Zones';

        const locations = this.state.locations.map(location => location.displayName);
        const zones = this.state.zones.map(zone => zone.displayName);
        
        if (this.state.currentLocation) {
            locationSelection = (
                <Selection
                    defaultValue={defaultValue_locations}
                    selectedItem={this.state.currentLocation.displayName}
                    onSelectionChanged={this.onLocationChanged}
                    items={locations} />
            );
            if (this.state.currentZone) {
                const selectedZone = this.state.currentZone 
                    ? this.state.currentZone.displayName 
                    : this.state.zones[0].displayName;
                
                zoneSelection = (
                    <Selection
                    defaultValue={defaultValue_zones}
                    selectedItem={selectedZone}
                    onSelectionChanged={this.onZoneChanged}
                    items={zones} />
                );
            } else {
                zoneSelection = (
                    <Selection
                        defaultValue={defaultValue_zones}
                        selectedItem={defaultValue_zones}
                        onSelectionChanged={this.onZoneChanged}
                        items={zones} />
                );
            }
        } else {
            locationSelection = (
                <Selection
                    defaultValue={defaultValue_locations}
                    selectedItem={defaultValue_locations}
                    onSelectionChanged={this.onLocationChanged}
                    items={locations} />
            );
        }
        return (
            <>
                <div>MachineOrganizer: locations, zones, machines</div>
                {
                    this.state.loading 
                    ? <div>Loading...</div> 
                    : (
                        <div>
                            {
                                this.state.currentLocation 
                                ? (<span>{locationSelection}&raquo;{zoneSelection}</span>) 
                                : (
                                    <>
                                        <span>{locationSelection}</span>
                                        <div>
                                            <LocationCards locations={this.state.locations} />
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    )
                }
            </>
        );
    }
};
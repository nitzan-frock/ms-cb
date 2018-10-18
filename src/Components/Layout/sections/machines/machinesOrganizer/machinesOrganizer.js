import React, { Component } from 'react';

import DataTools from '../../../../../data/DataTools';
import Selection from '../../../../UI/selection/selection';
import LocationCards from './cards/locationCards/locationCards';
import ZoneCards from './cards/zoneCards/zoneCards';
import DatahubCards from './cards/datahubCards/datahubCards';
import MachineCards from './cards/machineCards/machineCards';

import './machinesOrganizer.scss';

// CARD TYPES
const LOCATION_CARDS = 'location';
const ZONE_CARDS = 'zone';
const DATAHUB_CARDS = 'datahub';
const MACHINE_CARDS = 'machine';

export default class MachinesOrganizer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            locations: [],
            zones: [],
            machines: [],
            datahubs: [],
            showCardType: undefined,
            currentLocation: undefined,
            currentZone: undefined,
            currentDatahub: undefined
        };
    }

    async componentDidMount() {
        const company_id = this.props.activeCompany.id;
        const defaultLocation_id = this.props.activeUser.defaultLocationId;
        const locations = await DataTools.getLocations({company_id});

        if (!defaultLocation_id){
            this.setState({ loading: false, locations });
            return;
        }

        const location = (await DataTools.getLocations({location_id: defaultLocation_id}))[0];
        const zones = await DataTools.getZones({location_id: location.id});
        const datahubs = await DataTools.getDatahubs({location_id: location.id});

        this.setState({
            loading: false,
            currentLocation: location,
            showCardType: LOCATION_CARDS,
            childOfLocation: null,
            locations,
            zones,
            datahubs
        });
    }

    onLocationSelectionChanged = async event => {
        event.preventDefault();
        console.log(event.target.value);
        const currentLocation = this.getItemFromListByName(this.state.locations, event.target.value);
        this.enterLocation(currentLocation);
    }

    onZoneSelectionChanged = async event => {
        event.preventDefault();
        const currentZone = this.getItemFromListByName(this.state.zones, event.target.value);
        const machines = await this.getMachinesFor(currentZone);
        this.setState({machines, currentZone});
    }

    onDatahubSelectionChanged = async event => {
        event.preventDefault();
        const currentDatahub = this.getItemFromListByName(this.state.datahubs, event.target.value);
        const machines = await this.getMachinesFor(currentDatahub);
        this.setState({machines, currentDatahub});
    }

    getItemFromListByName = (list, name) => {
        return list.map(item => item.displayName === name ? item : null)
            .reduce((item, next) => item ? item : next);
    }

    showLocations = () => {
        this.setState({
            showCardType: LOCATION_CARDS,
            zones: [],
            datahubs: [],
            childOfLocation: null,
            currentLocation: undefined,
            currentZone: undefined
        });
    }

    showZones = location => {
        this.enterLocation(location, ZONE_CARDS);
    }

    showDatahubs = location => {
        this.enterLocation(location, DATAHUB_CARDS);
    }

    enterLocation = async (location, toShow) => {
        if (toShow === DATAHUB_CARDS || this.state.childOfLocation === DATAHUB_CARDS) {
            const datahubs = await DataTools.getDatahubs({location_id: location.id});
            console.log(datahubs);
            this.setState({
                datahubs,
                showCardType: DATAHUB_CARDS,
                childOfLocation: DATAHUB_CARDS,
                currentLocation: location,
                currentDatahub: undefined
            });
        } else {
            const zones = await DataTools.getZones({location_id: location.id});
            this.setState({
                zones,
                showCardType: ZONE_CARDS,
                childOfLocation: ZONE_CARDS,
                currentLocation: location,
                currentZone: undefined
            });
        }
    }

    enterZone = async zone => {
        const machines = await this.getMachinesFor(zone);
        this.setState({machines, currentZone: zone, showCardType: MACHINE_CARDS})
    }

    enterDatahub = async datahub => {
        const machines = await this.getMachinesFor(datahub);
        this.setState({machines, currentDatahub: datahub, showCardType: MACHINE_CARDS})
    }

    editMachine = async machine => {
        //todo: show modal for machine editting form
    }

    getMachinesFor = async container => {
        let zone_id;
        let datahub_serial;

        if (container.dataType === 'zone') zone_id = container.id;
        else if (container.dataType === 'datahub') datahub_serial = container.serial;

        return await DataTools.getMachines({zone_id, datahub_serial});
    }

    render() {
        let locationSelection = null;
        let childSelection = null;

        const locationSelectionItems = this.state.locations;
        const zoneSelectionItems = this.state.zones;
        const datahubSelectionItems = this.state.datahubs.map(datahub => {
            datahub.displayName = datahub.displayName ? datahub.displayName : datahub.serial
            return datahub;
        });
        
        if (this.state.currentLocation) {
            locationSelection = (
                <div>
                    <a href="#" onClick={this.showLocations}>Locations&raquo;</a>
                    <Selection
                        selectedItem={this.state.currentLocation.displayName}
                        onSelectionChanged={this.onLocationSelectionChanged}
                        items={locationSelectionItems} />
                </div>
            );
            if (this.state.currentZone) {
                console.log(`showing zones selection`);
                const selectedZone = this.state.currentZone 
                    ? this.state.currentZone.displayName 
                    : this.state.zones[0].displayName;
                
                childSelection = (
                    <div>
                        <a href="#" onClick={this.showZones}>Zones&raquo;</a>
                        <Selection
                            selectedItem={selectedZone}
                            onSelectionChanged={this.onZoneSelectionChanged}
                            items={zoneSelectionItems} />
                    </div>
                );
            } else if (this.state.currentDatahub){
                const selectedDatahub = this.state.currentDatahub 
                    ? this.state.currentDatahub.displayName
                        ? this.state.currentDatahub.displayName
                        : this.state.currentDatahub.mac
                    : this.state.datahubs[0].displayName
                        ? this.state.datahubs[0].displayName
                        : this.state.datahubs[0].mac;

                childSelection = (
                    <div>
                        <a href="#" onClick={this.showDatahubs}>Datahubs&raquo;</a>
                        <Selection
                            selectedItem={selectedDatahub}
                            onSelectionChanged={this.onDatahubSelectionChanged}
                            items={datahubSelectionItems} />
                    </div>
                );
            } else if (this.state.childOfLocation === ZONE_CARDS) {
                childSelection = (
                    <span>Zones</span>
                );
            } else if (this.state.childOfLocation === DATAHUB_CARDS) {
                childSelection = (
                    <span>Datahubs</span>
                );
            }
        } else {
            locationSelection = (
                <span>Locations</span>
            );
        }

        let cards = (
            <LocationCards 
                locations={this.state.locations} 
                showZones={this.showZones} 
                showDatahubs={this.showDatahubs} />
        );
        
        if (this.state.showCardType === ZONE_CARDS) {
            cards = <ZoneCards zones={this.state.zones} enterZone={this.enterZone}/>;
        } else if (this.state.showCardType === MACHINE_CARDS) {
            cards = <MachineCards machines={this.state.machines} editMachine={this.editMachine}/>
        } else if (this.state.showCardType === DATAHUB_CARDS) {
            cards = <DatahubCards datahubs={this.state.datahubs} enterDatahub={this.enterDatahub}/>
        }

        return this.state.loading 
            ? <div>Loading...</div> 
            : (
                <>
                    <br/>
                    {locationSelection}
                    {childSelection}
                    <div className="cards-container">
                        {cards}
                    </div>
                </>
            );
    }
};
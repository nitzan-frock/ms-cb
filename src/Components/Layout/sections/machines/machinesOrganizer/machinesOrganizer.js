import React, { Component } from 'react';

import DataTools from '../../../../../data/DataTools';
import Selection from '../../../../UI/selection/selection';
import LocationCards from './cards/locationCards/locationCards';
import ZoneCards from './cards/zoneCards/zoneCards';
import DatahubCards from './cards/datahubCards/datahubCards';
import MachineCards from './cards/machineCards/machineCards';
import Modal from '../../../../UI/modal/modal';
import Button from '../../../../UI/button/button';
import Form from '../../../../UI/form/form';

import './machinesOrganizer.scss';

// CARD TYPES
const LOCATION = 'LOCATION';
const ZONE = 'ZONE';
const DATAHUB = 'DATAHUB';
const MACHINE_CARDS = 'MACHINE';

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
            currentDatahub: undefined,
            showModal: false,
        };
    }

    async componentDidMount() {
        const company_id = this.props.activeCompany.id;
        const defaultLocation_id = this.props.activeUser.defaultLocationId;
        const locations = await DataTools.getLocations({ company_id });

        if (!defaultLocation_id) {
            this.setState({ loading: false, locations });
            return;
        }

        const location = (await DataTools.getLocations({ location_id: defaultLocation_id }))[0];
        const zones = await DataTools.getZones({ location_id: location.id });
        const datahubs = await DataTools.getDatahubs({ location_id: location.id });

        this.setState({
            loading: false,
            currentLocation: location,
            showCardType: LOCATION,
            childOfLocation: null,
            locations,
            zones,
            datahubs
        });
    }

    async componentDidUpdate(prevProps, prevState) {
        
    }

    onLocationSelectionChanged = async event => {
        event.preventDefault();
        const currentLocation = this.getItemFromListByName(this.state.locations, event.target.value);
        this.enterLocation(currentLocation);
    }

    onZoneSelectionChanged = async event => {
        event.preventDefault();
        const currentZone = this.getItemFromListByName(this.state.zones, event.target.value);
        const machines = await this.getMachinesFor(currentZone);
        this.setState({ machines, currentZone });
    }

    onDatahubSelectionChanged = async event => {
        event.preventDefault();
        const currentDatahub = this.getItemFromListByName(this.state.datahubs, event.target.value);
        const machines = await this.getMachinesFor(currentDatahub);
        this.setState({ machines, currentDatahub });
    }

    getItemFromListByName = (list, name) => {
        return list.map(item => item.displayName === name ? item : null)
            .reduce((item, next) => item ? item : next);
    }

    showLocations = () => {
        this.setState({
            showCardType: LOCATION,
            zones: [],
            datahubs: [],
            childOfLocation: null,
            currentLocation: undefined,
            currentZone: undefined
        });
    }

    showZones = location => {
        this.enterLocation(location, ZONE);
    }

    showDatahubs = location => {
        this.enterLocation(location, DATAHUB);
    }

    enterLocation = async (location, toShow) => {
        if (toShow === DATAHUB || this.state.childOfLocation === DATAHUB) {
            const datahubs = (await DataTools.getDatahubs({ company_id: this.props.activeCompany.id }));
            this.setState({
                datahubs,
                showCardType: DATAHUB,
                childOfLocation: DATAHUB,
                currentLocation: location,
                currentDatahub: undefined
            });
        } else {
            const zones = await DataTools.getZones({ location_id: location.id });
            this.setState({
                zones,
                showCardType: ZONE,
                childOfLocation: ZONE,
                currentLocation: location,
                currentZone: undefined
            });
        }
    }

    enterZone = async zone => {
        const machines = await this.getMachinesFor(zone);
        this.setState({ machines, currentZone: zone, showCardType: MACHINE_CARDS })
    }

    enterDatahub = async datahub => {
        const machines = await this.getMachinesFor(datahub);
        this.setState({ machines, currentDatahub: datahub, showCardType: MACHINE_CARDS })
    }

    editMachine = async machine => {
        //todo: show modal for machine editting form
    }

    getMachinesFor = async container => {
        let zone_id;
        let datahub_serial;

        if (container.dataType === 'zone') zone_id = container.id;
        else if (container.dataType === 'datahub') datahub_serial = container.serial;

        return await DataTools.getMachines({ zone_id, datahub_serial });
    }

    showModal = () => {
        const prevState = { ...this.state };
        this.setState({ showModal: !prevState.showModal });
    }

    addLocationToCompany = async (location) => {
        const company_id = this.props.activeCompany.id;
        const locationName = location.name;
        const description = location.description;

        try {
            const response = await DataTools.addLocation(locationName, description, company_id);
            if (!response.ok){
                throw response;
            }
            const locations = await DataTools.getLocations({company_id});
            this.setState({locations})
            return response;
        }
        catch (err) {
            return err;
        }
    }

    submitZone = async () => {

    }

    addMachine = async () => {

    }

    addDatahubToLocation = async (formValues) => {
        const company_id = this.props.activeCompany.id;

        const datahub = this.state.datahubs.filter(datahub => {
            return Object.keys(formValues)
                .map(key => datahub[key] === formValues[key] ? datahub : null)
                .reduce((prev, curr) => prev ? prev : curr);
        })[0];

        try {
            const response = await DataTools.updateDatahub(datahub, 'add', { 
                location: this.state.currentLocation
            });
            if (!response.ok){
                throw response;
            }
            await DataTools.updateLocation(this.state.currentLocation, 'add', {datahub: true});
            const datahubs = await DataTools.getDatahubs({company_id});
            this.setState({datahubs});
            return response;
        }
        catch (err) {
            return err;
        }
    }

    render() {
        let locationSelection = null;
        let childSelection = null;

        const locationSelectionItems = this.state.locations;
        const zoneSelectionItems = this.state.zones;
        

        if (this.state.currentLocation) {
            locationSelection = (
                <div>
                    <a href="#" onClick={this.showLocations}>Locations</a><span>&raquo;</span>
                    <Selection
                        value={this.state.currentLocation.displayName}
                        changed={this.onLocationSelectionChanged}
                        items={locationSelectionItems} />
                </div>
            );
            if (this.state.currentZone) {
                const selectedZone = this.state.currentZone.displayName;

                childSelection = (
                    <div>
                        <a href="#" onClick={() => this.showZones(this.state.currentLocation)}>Zones</a><span>&raquo;</span>
                        <Selection
                            value={selectedZone}
                            changed={this.onZoneSelectionChanged}
                            items={zoneSelectionItems} />
                    </div>
                );
            } else if (this.state.currentDatahub) {
                const datahubSelectionItems = this.state.datahubs.filter(datahub => {
                    if (datahub.locationId === this.state.currentLocation.id) {
                        return datahub;
                    }
                });
                const selectedDatahub = this.state.currentDatahub.displayName;

                childSelection = (
                    <div>
                        <a href="#" onClick={() => this.showDatahubs(this.state.currentLocation)}>Datahubs&raquo;</a>
                        <Selection
                            value={selectedDatahub}
                            changed={this.onDatahubSelectionChanged}
                            items={datahubSelectionItems} />
                    </div>
                );
            } else if (this.state.childOfLocation === ZONE) {
                childSelection = (
                    <span>Zones</span>
                );
            } else if (this.state.childOfLocation === DATAHUB) {
                let datahubs = this.state.datahubs.filter(datahub => {
                    if (!datahub.locationId) {
                        return datahub;
                    }
                }).map(datahub => { 
                    const value = datahub.serial;
                    const displayName = datahub.displayName ? datahub.displayName : value;
                    return {value, displayName};
                });
                const newDatahubFields = [
                    {
                        name: "serial",
                        type: "select",
                        items: datahubs,
                        defaultValue: "Select a Datahub"
                    }
                ];
                childSelection = (
                    <div>
                        <span>Datahubs</span>
                        <Button clicked={this.showModal}>Add Datahub</Button>
                        {
                        this.state.showModal 
                            ? (<Modal
                                show={this.state.showModal}
                                modalClosed={this.showModal} >
                                <Form
                                    fields={newDatahubFields}
                                    reset={this.state.showModal}
                                    submitForm={this.addDatahubToLocation} />
                            </Modal>)
                            : null
                        }
                    </div>
                );
            }
        } else {
            const newLocationFields = [
                {
                    type: "input",
                    name: "name",
                    maxLength: 20,
                    placeholder: "Location Name"
                },
                {
                    type: "input",
                    name: "description",
                    maxLength: 50,
                    placeholder: "Description"
                }
            ];
            locationSelection = (
                <div>
                    <span>Locations</span>
                    <Button clicked={this.showModal}>Add Location</Button>
                    {
                        this.state.showModal 
                            ? (<Modal
                                show={this.state.showModal}
                                modalClosed={this.showModal} >
                                <Form
                                    fields={newLocationFields}
                                    reset={this.state.showModal}
                                    submitForm={this.addLocationToCompany} />
                            </Modal>)
                            : null
                    }
                </div>
            );
        }

        let cards = (
            <LocationCards
                locations={this.state.locations}
                showZones={this.showZones}
                showDatahubs={this.showDatahubs} />
        );

        if (this.state.showCardType === ZONE) {
            cards = <ZoneCards zones={this.state.zones} enterZone={this.enterZone} />;
        } else if (this.state.showCardType === MACHINE_CARDS) {
            cards = <MachineCards machines={this.state.machines} editMachine={this.editMachine} />
        } else if (this.state.showCardType === DATAHUB) {
            cards = (
                <DatahubCards 
                    datahubs={
                        this.state.datahubs.filter(datahub => {
                            return datahub.locationId === this.state.currentLocation.id ? datahub : null
                        }) 
                    }
                    enterDatahub={this.enterDatahub} />
            )
        }

        return this.state.loading
            ? <div>Loading...</div>
            : (
                <>
                    <br />
                    {locationSelection}
                    {childSelection}
                    <div className="cards-container">
                        {cards}
                    </div>
                </>
            );
    }
};
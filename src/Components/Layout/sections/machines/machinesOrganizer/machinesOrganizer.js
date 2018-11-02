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
            sensors: [],
            datahubs: [],
            showCardType: undefined,
            currentLocation: undefined,
            currentZone: undefined,
            currentDatahub: undefined,
            showModal: false,
            modal: null
        };
    }

    async componentDidMount() {
        const company_id = this.props.activeCompany.id;
        const defaultLocation_id = this.props.activeUser.defaultLocationId;
        const locations = await DataTools.getLocations({ company_id });
        const datahubs = await DataTools.getDatahubs({ company_id });
        const sensors = await DataTools.getSensors({ company_id });

        if (!defaultLocation_id) {
            this.setState({
                loading: false,
                locations,
                datahubs,
                sensors
            });
            return;
        }

        const location = locations.map(location => {
            return location.id === defaultLocation_id ? location : null
        }).reduce((prev, curr) => prev ? prev : curr);
        const zones = await DataTools.getZones({ location_id: location.id });

        this.setState({
            loading: false,
            currentLocation: location,
            showCardType: LOCATION,
            childOfLocation: null,
            locations,
            zones,
            datahubs,
            sensors
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
        const machines = await this.getMachinesFor(location);
        if (toShow === DATAHUB || this.state.childOfLocation === DATAHUB) {
            const datahubs = await DataTools.getDatahubs({ company_id: this.props.activeCompany.id });
            this.setState({
                datahubs: await datahubs,
                machines: await machines,
                showCardType: DATAHUB,
                childOfLocation: DATAHUB,
                currentLocation: location,
                currentDatahub: undefined
            });
        } else {
            const zones = await DataTools.getZones({ location_id: location.id });
            this.setState({
                zones,
                machines,
                showCardType: ZONE,
                childOfLocation: ZONE,
                currentLocation: location,
                currentZone: undefined
            });
        }
    }

    enterZone = async zone => {
        const machines = this.state.machines.filter(machine => machine.zoneId === zone.id ? machine : null);
        this.setState({ machines, currentZone: zone, showCardType: MACHINE_CARDS })
    }

    enterDatahub = async datahub => {
        const machines = this.state.machines.filter(machine => machine.datahubSerial === datahub.serial ? machine : null);
        this.setState({ machines, currentDatahub: datahub, showCardType: MACHINE_CARDS })
    }

    editMachine = async machine => {
        //todo: show modal for machine editting form
    }

    getMachinesFor = async container => {
        let location_id;
        let zone_id;
        let datahub_serial;

        if (container.dataType === 'location') location_id = container.id;
        else if (container.dataType === 'zone') zone_id = container.id;
        else if (container.dataType === 'datahub') datahub_serial = container.serial;

        return await DataTools.getMachines({ location_id, zone_id, datahub_serial });
    }

    showModal = (type) => {
        const prevState = { ...this.state };
        this.setState({ showModal: !prevState.showModal, modal: type });
    }

    addLocationToCompany = async (formValues) => {
        const company_id = this.props.activeCompany.id;
        const location = {};
        Object.keys(formValues).forEach(key => {
            location[key] = formValues[key];
        });

        try {
            const response = await DataTools.addLocation(location.name, location.description, company_id);
            if (!response.ok) {
                throw response;
            }
            const locations = await DataTools.getLocations({ company_id });
            this.setState({ locations })
            return response;
        }
        catch (err) {
            return err;
        }
    }

    addZoneToLocation = async (formValues) => {
        const location = this.state.currentLocation;
        const zone = {};
        Object.keys(formValues).forEach(key => {
            zone[key] = formValues[key];
        });

        try {
            const response = await DataTools.addZone(zone.name, zone.description, location);
            if (!response.ok) {
                throw response;
            }
            const zones = await DataTools.getZones({ location_id: location.id });
            this.setState({ zones });
            return response;
        }
        catch (err) {
            return err;
        }
    }

    addDatahubToLocation = async (formValues) => {
        const company_id = this.props.activeCompany.id;

        const datahub = this.state.datahubs.filter(datahub => {
            return Object.keys(formValues)
                .map(key => datahub[key] === formValues[key] ? datahub : null)
                .reduce((prev, curr) => prev ? prev : curr);
        })[0];

        try {
            const response = await DataTools.updateDatahub(datahub, 'add',
                { location: this.state.currentLocation }
            );
            if (!response.ok) {
                throw response;
            }

            const datahubs = await DataTools.getDatahubs({ company_id });
            this.setState({ datahubs });
            return response;
        }
        catch (err) {
            return err;
        }
    }

    // Onboard sensor to a machine
    onboardSensor = async formValues => {

    }


    render() {
        let locationSelection = null;
        let childSelection = null;

        const locationSelectionItems = this.state.locations;
        const zoneSelectionItems = this.state.zones;

        let modal = null;
        switch (this.state.modal) {
            case 'location':
                const newLocationFields = [
                    {
                        section: 1,
                        type: "input",
                        name: "name",
                        maxLength: 20,
                        placeholder: "Location Name"
                    },
                    {
                        section: 1,
                        type: "input",
                        name: "description",
                        maxLength: 50,
                        placeholder: "Description"
                    }
                ];
                modal = (
                    <Modal
                        show={this.state.showModal}
                        modalClosed={this.showModal} >
                        <Form
                            fields={newLocationFields}
                            reset={this.state.showModal}
                            submitForm={this.addLocationToCompany} />
                    </Modal>
                );
                break;
            case 'onboardSensor':
                const sensors = this.state.sensors.map(sensor => {
                    return { value: sensor.serial, displayName: sensor.serial }
                });
                console.log(`[machineOrganizer]`);
                console.log(this.state.machines);

                const isNewMachine = val => {
                    console.log(`isNewMachine`);
                    console.log(val);
                    return val === "new";
                }

                const isExistingMachine = val => {
                    return val === "existing";
                }

                const isVPAorCA = val => {
                    return val.match(/ca|vpa/i) ? true : false;
                }

                const isZoneSelected = val => {
                    return val ? true : false;
                }

                const filterByZone = (val, zone_id) => {
                    return val === zone_id ? val : null;
                }

                const onboardSensorFields = [
                    {
                        section: 1,
                        id: 0,
                        type: "select",
                        name: "sensor",
                        items: sensors
                    },
                    {
                        section: 1,
                        id: 1,
                        type: "radio",
                        name: "machineType",
                        legend: "Will this be a new or existing machine?",
                        items: [
                            {value: "new", label: "New"}, 
                            {value: "existing", label: "Existing"}
                        ]
                    },
                    {
                        section: 2,
                        id: 2,
                        type: "select",
                        name: "zone",
                        items: this.state.zones.map(zone => {
                            return {value: zone.id, displayName: zone.displayName};
                        })
                    },
                    {
                        section: 2,
                        id: 3,
                        type: "input",
                        name: "newMachine",
                        maxLength: 20,
                        placeholder: "Machine Name",
                        options: {
                            isVisible: [{callback: isNewMachine, id: 1}]
                        }
                    },
                    {
                        section: 2,
                        id: 4,
                        type: "select",
                        name: "existingMachine",
                        items: this.state.machines.map(machine => {
                            return {
                                value: machine.id, 
                                filterValue: machine.zoneId, 
                                displayName: machine.displayName
                            }
                        }),
                        options: {
                            isVisible: [{callback: isExistingMachine, id: 1}, {callback: isZoneSelected, id: 2}],
                            filterByField: {callback: filterByZone, id: 2}
                        }
                    },
                    {
                        section: 3,
                        id: 5,
                        type: "select",
                        name: "datahub",
                        items: this.state.datahubs,
                        options: {
                            isVisible: [{sensor: isVPAorCA}]
                        }
                    }
                ];
                modal = (
                    <Modal
                        show={this.state.showModal}
                        modalClosed={this.showModal} >
                        <Form
                            fields={onboardSensorFields}
                            reset={this.state.showModal}
                            submitForm={this.onboardSensor} />
                    </Modal>
                );
                break;
            case 'zone': 
                const newZoneFields = [
                    {
                        section: 1,
                        type: "input",
                        name: "name",
                        maxLength: 20,
                        placeholder: "Zone Name"
                    },
                    {
                        section: 1,
                        type: "input",
                        name: "description",
                        maxLength: 50,
                        placeholder: "Description"
                    }
                ];
                modal = (
                    <Modal
                        show={this.state.showModal}
                        modalClosed={this.showModal} >
                        <Form
                            fields={newZoneFields}
                            reset={this.state.showModal}
                            submitForm={this.addZoneToLocation} />
                    </Modal>
                );
                break;
            case 'datahub':
                let datahubs = this.state.datahubs.filter(datahub => {
                    if (!datahub.locationId) {
                        return datahub;
                    }
                }).map(datahub => {
                    const value = datahub.serial;
                    const displayName = datahub.displayName ? datahub.displayName : value;
                    return { value, displayName };
                });
                const newDatahubFields = [
                    {
                        section: 1,
                        name: "serial",
                        type: "select",
                        items: datahubs,
                        defaultValue: "Select a Datahub"
                    }
                ];
                modal = (
                    <Modal
                        show={this.state.showModal}
                        modalClosed={this.showModal} >
                        <Form
                            fields={newDatahubFields}
                            reset={this.state.showModal}
                            submitForm={this.addDatahubToLocation} />
                    </Modal>
                );
                break;
            default: 
                break;
        }

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
                        <Button clicked={this.showModal}>Onboard Sensor</Button>
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
                    <div>
                        <span>Zones</span>
                        <Button clicked={() => this.showModal('zone')}>Add Zone</Button>
                        <Button clicked={() => this.showModal('onboardSensor')} >Onboard Sensor</Button>
                        {modal}
                    </div>
                );
            } else if (this.state.childOfLocation === DATAHUB) {
                childSelection = (
                    <div>
                        <span>Datahubs</span>
                        <Button clicked={() => this.showModal('datahub')}>Add Datahub</Button>
                        {modal}
                    </div>
                );
            }
        } else {
            locationSelection = (
                <div>
                    <span>Locations</span>
                    <Button clicked={() => this.showModal('location')} >Add Location</Button>
                    {modal}
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
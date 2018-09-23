import React, { Component } from 'react';

import Aux from '../../../../tools/auxiliary';
import StringManipulator from '../../../../tools/stringManipulator/StringManipulator';
import DataRetriever from '../../../../data/DataRetriever';
import SensorInventory from './sensorInventory/sensorInventory';
import MachinesOrganizer from './machinesOrganizer/machinesOrganizer';
import Modal from '../../../UI/modal/modal';
import NewItemForm from '../../../Layout/sections/machines/sensorInventory/newItemForm/newItemForm';

class Machines extends Component {
    constructor(props){
        super(props);
        this.state = {
            companyID: this.props.activeUser.companyID,
            company: null,
            sensors: null,
            datahubs: null,
            locations: null,
            currentLocation: this.props.activeUser.defaultLocation,
            currentZone: null,
            selectedItem: undefined,
            showModal: false,
            newItemSN: "",
            newItemMAC: ""
        }
    }

    componentDidMount() {
        const company = DataRetriever.getCompanyName(this.state.companyID);
        const sensors = DataRetriever.getSensors(this.state.companyID);
        const datahubs = DataRetriever.getDatahubs(this.state.companyID);
        const locations = DataRetriever.getLocations(this.state.companyID);

        this.setState({
            company: company,
            sensors: sensors,
            datahubs: datahubs,
            locations: locations,
        });
    }

    selectedItemChangedHandler = (event) => {
        this.setState({selectedItem: event.target.value});
    }

    showModalHandler = () => {
        const showModal = this.state.showModal;
        this.setState({
            showModal: !showModal, 
            newItemSN: "",
            newItemMAC: ""
        });
    }

    addNewItemHandler = () => {
        event.preventDefault();
    }

    newItemSNChangedHandler = (event) => {
        const serialNum = StringManipulator.serialNumberFormatter(event.target.value);
        this.setState({newItemSN: event.target.value});
    }

    newItemMACChangedHandler = (event) => {
        const mac = StringManipulator.MACAddressFormatter(event.target.value);
        this.setState({newItemMAC: mac});
    }

    render() {
        return (
            <Aux>
                <Modal show={this.state.showModal} modalClosed={this.showModalHandler} >
                    <NewItemForm 
                        submitHandler={this.addNewItemHandler}
                        newItemSN={this.state.newItemSN}
                        newItemSNChanged={this.newItemSNChangedHandler}
                        newItemMAC={this.state.newItemMAC}
                        newItemMACChanged={this.newItemMACChangedHandler} />
                </Modal>
                <SensorInventory 
                    sensors={this.state.sensors} 
                    datahubs={this.state.datahubs} 
                    selectedItem={this.state.selectedItem}
                    selectedItemChanged={this.selectedItemChangedHandler}
                    showModal={this.state.showModal}
                    showModalClicked={this.showModalHandler}
                    addNewItem={this.addNewItemHandler} />
                <MachinesOrganizer locations={this.state.locations} />
            </Aux>
        );
    }
}

export default Machines;
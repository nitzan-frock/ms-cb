import React, { Component } from 'react';
import UUID from 'uuid/v1';

import Aux from '../../../../tools/auxiliary';
import DataTools from '../../../../data/DataTools';
import StringManipulator from '../../../../tools/stringManipulator/StringManipulator';
import SensorInventory from './sensorInventory/sensorInventory';
import MachinesOrganizer from './machinesOrganizer/machinesOrganizer';
import Modal from '../../../UI/modal/modal';
import NewItemForm from '../../../Layout/sections/machines/sensorInventory/newItemForm/newItemForm';
import ItemCreator from '../../../../data/Item/ItemCreator';

class Machines extends Component {
    constructor(props){
        super(props);
        this.state = {
            companyID: this.props.activeUser.companyID,
            companyDisplayName: null,
            sensors: null,
            datahubs: null,
            locations: null,
            currentLocation: this.props.activeUser.defaultLocation,
            currentZone: null,
            selectedItem: undefined,
            showModal: false,
            newItemSN: "",
            newItemMAC: "",
            invalidEntry: ""
        }
    }

    componentDidMount() {
        const companyDisplayName = DataTools.getCompanyName(this.state.companyID);
        const sensors = DataTools.getSensors(this.state.companyID);
        const datahubs = DataTools.getDatahubs(this.state.companyID);
        const locations = DataTools.getLocations(this.state.companyID);

        this.setState({
            companyDisplayName: companyDisplayName,
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
        const company = this.state.companyID;
        const serial = this.state.newItemSN;
        const mac = this.state.newItemMAC.replace(/[^a-z0-9]/ig, "");

        try {
            DataTools.addNewItem(ItemCreator.create(serial, mac), company);
        }
        catch (e) {
            this.setState({invalidEntry: e});
        }
    }

    newItemSNChangedHandler = (event) => {
        console.log(event.target.value);
        this.setState({newItemSN: event.target.value});
    }

    newItemSNEnteredHandler = (event) => {
        console.log(event.target.value);
        const serialNum = StringManipulator.serialNumberFormatter(event.target.value);
        this.setState({newItemSN: serialNum});
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
                        newItemSN={this.state.newItemSN}
                        newItemSNChanged={this.newItemSNChangedHandler}
                        newItemSNEntered={this.newItemSNEnteredHandler}
                        newItemMAC={this.state.newItemMAC}
                        newItemMACChanged={this.newItemMACChangedHandler}
                        submitForm={this.addNewItemHandler}
                        invalidEntry={this.state.invalidEntry} />
                </Modal>
                <SensorInventory 
                    sensors={this.state.sensors} 
                    datahubs={this.state.datahubs} 
                    selectedItem={this.state.selectedItem}
                    selectedItemChanged={this.selectedItemChangedHandler}
                    showModal={this.state.showModal}
                    showModalClicked={this.showModalHandler} />
                <MachinesOrganizer locations={this.state.locations} />
            </Aux>
        );
    }
}

export default Machines;
import React, { Component } from 'react';

import Button from '../../../../UI/button/button';
import Selection from '../../../../UI/selection/selection';
import Modal from '../../../../UI/modal/modal';
import NewItemForm from '../itemInventory/newItemForm/newItemForm';
import ItemList from './ItemList/ItemList';
import ItemCreator from '../../../../../data/Item/ItemCreator';
import DataTools from '../../../../../data/DataTools';
import StringManipulator from '../../../../../tools/stringManipulator/StringManipulator';


const DATAHUBS = 'DATAHUBS';
const SENSORS = 'SENSORS';
const OEM = 'OEM'; 

export default class ItemInventory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItem: undefined,
            showModal: false,
            newItemSN: "",
            newItemMAC: "",
            invalidEntry: "",
            itemsPerPage: 10,
        }
        
    }

    selectedItemChangedHandler = (event) => {
        this.setState({selectedItem: event.target.value});
    }

    showModalHandler = () => {
        const showModal = this.state.showModal;
        this.setState({
            showModal: !showModal, 
            newItemSN: "",
            newItemMAC: "",
            invalidEntry: ""
        });
    }

    addNewItemHandler = async () => {
        // add item on enter key press
        const company_id = this.props.companyId;
        const serial = this.state.newItemSN;
        const mac = this.state.newItemMAC.replace(/[^a-z0-9]/ig, "");

        try {
            const item = ItemCreator.create(serial, mac);
            const response = await DataTools.addItemToCompanyInventory(item, company_id);

            if (!response.ok){
                throw response.msg;
            }
        }
        catch (err) {
            this.setState({invalidEntry: err});
        }
    }

    newItemSNChangedHandler = (event) => {
        this.setState({newItemSN: event.target.value});
    }

    newItemSNEnteredHandler = (event) => {
        const serialNum = StringManipulator.serialNumberFormatter(event.target.value);
        this.setState({newItemSN: serialNum});
    }

    newItemMACChangedHandler = (event) => {
        const mac = StringManipulator.MACAddressFormatter(event.target.value);
        this.setState({newItemMAC: mac});
    }

    render() {
        const items = [DATAHUBS, SENSORS, OEM];
        const defaultSelectionValue = "Select A Product"; 
        return (
            <>
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
                <Selection 
                    defaultValue={defaultSelectionValue}
                    selectedItem={this.state.selectedItem}
                    selectedItemChanged={this.selectedItemChangedHandler}
                    items={items} />
                <Button clicked={this.showModalHandler}>Add New Item</Button>
                <ItemList 
                    companyId={this.props.activeUser.companyId}
                    itemSelections={{DATAHUBS, SENSORS, OEM}}
                    selectedItem={this.state.selectedItem} />
                <ul>
                    <li>TODO: list of sensors with filter by SN, machine</li>
                </ul>
            </>
        );
    }
}
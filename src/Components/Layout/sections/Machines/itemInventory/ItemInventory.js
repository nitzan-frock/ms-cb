import React, { Component } from 'react';

import Button from '../../../../UI/button/button';
import Modal from '../../../../UI/modal/modal';
import NewItemForm from '../itemInventory/newItemForm/newItemForm';
import ItemList from './ItemList/ItemList';
import ItemCreator from '../../../../../data/Item/ItemCreator';
import DataTools from '../../../../../data/DataTools';
import StringManipulator from '../../../../../tools/stringManipulator/StringManipulator';

export default class ItemInventory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            newItemSN: "",
            newItemMAC: "",
            invalidEntry: "",
            shouldListUpdate: false
        }
        
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
        const company_id = this.props.activeUser.companyId;
        const serial = this.state.newItemSN;
        const mac = this.state.newItemMAC.replace(/[^a-z0-9]/ig, "");

        try {
            const item = ItemCreator.create(serial, mac);
            const response = await DataTools.addItemToCompanyInventory(item, company_id);

            if (!response.ok){
                throw response.msg;
            }
            this.setShouldListUpdate();
        }
        catch (err) {
            this.setState({invalidEntry: err});
        }
    }

    setShouldListUpdate = () => {
        const prevState = this.state;
        this.setState({shouldListUpdate: !prevState.shouldListUpdate});
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
                <Button clicked={this.showModalHandler}>Add New Item</Button>
                <ItemList 
                    companyId={this.props.activeUser.companyId}
                    refresh={this.state.shouldListUpdate} />
            </>
        );
    }
}
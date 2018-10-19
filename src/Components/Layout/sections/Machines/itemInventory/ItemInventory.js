import React, { Component } from 'react';

import Button from '../../../../UI/button/button';
import Modal from '../../../../UI/modal/modal';
import Form from '../../../../UI/form/form';
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

    addNewItemHandler = async (values) => {
        // add item on enter key press
        const company_id = this.props.activeCompany.id;
        const serial = values.serial;
        const mac = values.mac.replace(/[^a-z0-9]/ig, "");

        try {
            const item = ItemCreator.create(serial, mac);
            const response = await DataTools.addItemToCompanyInventory(item, company_id);

            if (!response.ok){
                throw response.msg;
            }
            this.setShouldListUpdate();
            this.setState({invalidEntry: ""})
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

    newItemSNEnteredHandler = (str) => {
        const serial = StringManipulator.serialNumberFormatter(str);
        console.log(serial);
        return serial;
    }

    newItemMACChangedHandler = (str) => {
        const mac = StringManipulator.MACAddressFormatter(str);
        return mac;
    }

    render() {
        const formFields =[
            {
                name: "serial",
                maxLength: 13,
                placeholder: "Serial Number",
                options: {
                    formatter: this.newItemSNEnteredHandler,
                    formatOn: 'blur'
                }
            },
            {
                name: "mac",
                maxLength: 17,
                placeholder: "MAC Address",
                options: {
                    formatter: this.newItemMACChangedHandler,
                    formatOn: 'change'
                }
            }
        ];
         
        return (
            <>
                <Modal show={this.state.showModal} modalClosed={this.showModalHandler} >
                    <Form 
                        fields={formFields}
                        reset={!this.state.showModal}
                        submitForm={this.addNewItemHandler}
                        invalidEntry={this.state.invalidEntry} />
                </Modal>
                <Button clicked={this.showModalHandler}>Add New Item</Button>
                <ItemList 
                    company={this.props.activeCompany}
                    refresh={this.state.shouldListUpdate}
                    setShouldListUpdate={this.setShouldListUpdate} />
            </>
        );
    }
}
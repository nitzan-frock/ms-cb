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
            invalidEntry: "",
            shouldListUpdate: false
        }
    }

    showModalHandler = () => {
        const showModal = this.state.showModal;
        this.setState({
            showModal: !showModal, 
            invalidEntry: ""
        });
    }

    addNewItemHandler = async (itemValues) => {
        // add item on enter key press
        const company_id = this.props.activeCompany.id;
        const serial = itemValues.serial;
        const mac = itemValues.mac.replace(/[^a-z0-9]/ig, "");

        try {
            const item = ItemCreator.create(serial, mac);
            const response = await DataTools.addItemToCompanyInventory(item, company_id);

            if (!response.ok){
                throw response;
            }
            this.setShouldListUpdate();
            return response;
        }
        catch (err) {
            return err;
        }
    }

    setShouldListUpdate = () => {
        const prevState = this.state;
        this.setState({shouldListUpdate: !prevState.shouldListUpdate});
    }

    render() {
        const formFields = [
            {
                name: "serial",
                maxLength: 13,
                placeholder: "Serial Number",
                options: {
                    formatter: StringManipulator.serialNumberFormatter,
                    formatOn: 'blur'
                }
            },
            {
                name: "mac",
                maxLength: 17,
                placeholder: "MAC Address",
                options: {
                    formatter: StringManipulator.MACAddressFormatter
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
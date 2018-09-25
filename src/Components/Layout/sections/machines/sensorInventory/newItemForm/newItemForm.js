import React, { Component } from 'react';

import Form from '../../../../../UI/form/form';
import Field from '../../../../../UI/form/field';

class newItemForm extends Component{
    componentDidMount(){
        console.log("[componentDidMount]");
    }

    shouldComponentUpdate(){
        console.log("[SCU]");
        return true;
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("[cdu]");
    }

    render() {
        return (
            <Form submitForm={this.props.submitForm} buttonName="Add Item">
                <Field 
                    name="serial" 
                    maxLength="13"
                    placeholder="Serial Number"
                    invalidEntry={this.props.invalidEntry}
                    value={this.props.newItemSN} 
                    changed={this.props.newItemSNChanged} 
                    unfocus={this.props.newItemSNEntered} />
                <Field 
                    name="mac" 
                    maxLength="17"
                    placeholder="MAC Address"
                    invalidEntry={this.props.invalidEntry}
                    value={this.props.newItemMAC} 
                    changed={this.props.newItemMACChanged} 
                    unfocus={this.props.newItemMACEntered} />
            </Form>
        );
    }
};

export default newItemForm;
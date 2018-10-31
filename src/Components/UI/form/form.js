import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Field from './field';
import Button from '../../UI/button/button';

import './form.scss';

export default class Form extends Component{
    constructor(props) {
        super(props);
        this.state = {
            currentSection: 1,
            fields: [],
            message: "",
            shouldReset: false
        }
    }

    componentDidMount() {
        let fields = [];

        this.props.fields.forEach(field => {
            fields.push(this.buildField(field));
        });
        this.setState({fields});
    }

    componentDidUpdate() {
        if (this.props.reset !== this.state.shouldReset) {
            this.setState(prevState => {
                const fields = prevState.fields;
                fields.forEach(field => {
                    field.value = "";
                    field.isValid = true;
                });

                const shouldReset = !prevState.shouldReset;

                return {fields, shouldReset};
            })
        }
    }

    // Initialization helper functions

    buildField = field => {
        field.options = this.setFieldOptions(field);
        return {
            ...field,
            value: "",
            isValid: true
        };
    }

    setFieldOptions = field => {
        const options = {
            formatter: input => input,
            formatOn: 'change'
        };

        if (field.options) {
            Object.keys(options).forEach(option => {
                if (field.options[option]) {
                    options[option] = field.options[option];
                }
            });
        }
  
        return options;
    }

    // Form Interaction Functions

    fieldChanged = (event, field, fieldIndex) => {
        event.preventDefault();
        const fields = this.state.fields;
        const formatter = field.options.formatter;
        const formatOn = field.options.formatOn;
        
        if (formatOn === event.type && formatter) {
            field.value = formatter(event.target.value);
        } else {
            field.value = event.target.value;
        }

        fields[fieldIndex] = field;

        this.setState({fields});
    }

    submitForm = async () => {
        let submitValues = {};
        const fields = this.state.fields;

        fields.forEach(field => {
            submitValues[field.name] = field.value;
        });

        const response = await this.props.submitForm(submitValues);

        if (!response.ok) {
            response.body.invalidFields.forEach(invalidField => {
                fields.forEach(field => {
                    if (field.name === invalidField) {
                        field.isValid = false;
                    }
                });
            });
            this.setState({fields, message: response.body.message});
        } else {
            this.setState({shouldReset: !this.props.reset, message: response.body.message});
        }
    }

    render() {
        let fields = [];
        let currentSection = this.state.currentSection;

        this.state.fields.forEach((field, index) => {
            if (field.section <= currentSection) {
                fields.push(
                    <Field 
                        key={index}
                        field={field}
                        changed={(e) => this.fieldChanged(e, field, index)} />
                );
            }
        });

        return (
            <>
                <div className="form">
                    {fields}
                    {this.state.message ? <p>{this.state.message}</p> : null}
                    <Button clicked={this.submitForm} >Submit</Button>
                </div>
            </>
        );
    }
};

const field = PropTypes.object.isRequired;

Form.propTypes = {
    fields: PropTypes.arrayOf(field).isRequired
}
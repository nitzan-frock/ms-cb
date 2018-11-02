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

        console.log(`cdm`);
        let fields = [];

        this.props.fields.forEach(field => {
            fields.push(this.buildFieldProps(field));
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

    buildFieldProps = props => {
        props.options = this.setFieldOptions(props);
        return {
            ...props,
            value: "",
            isValid: true
        };
    }

    setFieldOptions = field => {
        const options = {
            formatter: input => input,
            formatOn: 'change',
            isVisible: [{callback: () => true, id: null}],
            filterByField: null
        };

        // if (field.type === 'select') {
        //     field.options.filterByField = null;
        // }

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
        console.log(`[fieldChanged]`);
        
        const fields = this.state.fields;
        const formatter = field.options.formatter;
        const formatOn = field.options.formatOn;
        
        if (field.type === 'input' && event.type === formatOn) {
            console.log(`input changed`);
            field.value = formatter(event.target.value);
        } else {
            field.value = event.target.value;
        }
        
        fields[fieldIndex] = field;

        this.setState({fields, currentSection: this.nextSection(fieldIndex)});
    }

    nextSection = (currentIndex) => {
        const fields = this.state.fields;
        const currentSection = this.state.currentSection;
        const nextField = fields[currentIndex + 1];

        if (nextField.section > currentSection) {
            return nextField.section;
        }
        return currentSection;
    }

    isFieldVisible = (field) => {
        console.log(`\n[isFieldVisible]`);
        return field.options.isVisible.every(check => {
            if (!check.id) return true;

            const dependentField = this.state.fields[check.id];
            console.log(dependentField);
            return check.callback(dependentField.value);
        });
    }

    filterFieldItems = field => {
        console.log(`\n[filterFieldItems]`);
        const filterField_id = field.options.filterByField.id
        const filterValue = this.state.fields[filterField_id].value;
        const callback = field.options.filterByField.callback;

        console.log(field);

        field.items.filter(item => callback(filterValue, item.filterValue) ? item : null);
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
        console.log(`[render]`);
        let fields = [];
        let currentSection = this.state.currentSection;

        this.state.fields.forEach((field, index) => {
            if (field.section <= currentSection) {
                const isVisible = this.isFieldVisible(field);
                console.log(``);
                if (field.options.filterByField) {
                    console.log(`filter ${field.name} by field`);
                    console.log(field);
                    field.items = this.filterFieldItems(field);
                }
                isVisible ? fields.push(
                    <Field 
                        key={index}
                        field={field}
                        changed={(e) => this.fieldChanged(e, field, index)} />
                )
                : null;
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
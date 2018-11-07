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
            currentField: 0,
            fields: [],
            indices: {},
            message: "",
            shouldReset: false
        }
    }

    componentDidMount() {
        console.log(`[cdm]`);
        let fields = [];
        let indices = {};

        this.props.fields.forEach((field, index) => {
            fields.push(this.buildFieldProps(field));
            indices[field.name] = index;
        });
        this.setState({fields, indices});
    }

    componentDidUpdate() {
        console.log(`[cdu]`);
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
        return null;
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

    fieldChanged = (event, field) => {
        console.log(`[fieldChanged]`);
        
        const fields = [...this.state.fields];
        const currentFieldIdx = this.state.currentField;
        const formatter = field.options.formatter;
        const formatOn = field.options.formatOn;
        
        if (field.type === 'input' && event.type === formatOn) {
            field.value = formatter(event.target.value);
        } else {
            field.value = event.target.value;
        }

        const changedFieldIdx = this.getFieldIndex(field.name);

        if (changedFieldIdx < currentFieldIdx) {
            const currentSection = this.state.currentSection;
            for (let i = currentFieldIdx; i < fields.length; i++) {
                if (fields[i].section !== currentSection) { break; }
                fields[i].value = "";
            }
        }
        
        fields[field.id] = field;
        this.setState({
            fields, 
            currentSection: this.nextSection(field.id),
            currentField: field.id
        });
    }

    getFieldIndex = name => {
        const indices = {...this.state.indices};
        return indices[name];
    }

    nextSection = (currentIndex) => {
        const fields = this.state.fields;
        const currentSection = this.state.currentSection;
        const nextField = fields[currentIndex + 1];

        if (nextField.section > currentSection) {
            return nextField.section;
        } else if (!this.isFieldRequired(nextField)) {
            return nextField.section + 1;
        }
        return currentSection;
    }

    isFieldRequired = field => {
        if (!field.options.isRequired) { return false }
        return field.options.isRequired.every(check => {
            const dependentField = this.state.fields[check.id];
            return check.callback(dependentField.value);
        })
    }

    isFieldVisible = field => {
        return field.options.isVisible.every(check => {
            if (!check.id) return true;
            const dependentField = this.state.fields[check.id];
            return check.callback(dependentField.value);
        });
    }

    filterFieldItems = field => {
        console.log(`\n[filterFieldItems]`);
        const filterField_id = field.options.filterByField.id;
        const fieldFilterValue = this.state.fields[filterField_id].value;
        const callback = field.options.filterByField.callback;

        let filtered = field.items.filter(item => callback(item, fieldFilterValue));
        console.log(filtered);
        return filtered;
    }

    submitForm = async () => {
        let submitValues = {};
        const fields = [...this.state.fields];

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
        let currentSection = this.state.currentSection;

        let fields = this.state.fields.map((field, index) => {
            const tempField = {...field}
            if (tempField.section <= currentSection) {
                const isVisible = this.isFieldVisible(tempField);
                if (isVisible) {
                    if (tempField.options.filterByField) {
                        tempField.items = this.filterFieldItems(tempField);
                    }
                    
                    console.log(tempField);

                    return (
                        <Field 
                            key={index}
                            field={tempField}
                            changed={(e) => this.fieldChanged(e, tempField, index)} />
                    );
                }
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
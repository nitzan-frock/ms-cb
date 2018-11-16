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
        props.options = this.makeFieldOptions(props);
        return {
            ...props,
            value: "",
            isValid: true
        };
    }

    makeFieldOptions = field => {
        const options = {
            formatter: input => input,
            formatOn: 'change',
            dependencies: [],
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
        const fields = [...this.state.fields];
        const currentFieldIdx = this.state.currentField;
        const changedFieldIdx = this.getFieldIndex(field.name);
        const formatter = field.options.formatter;
        const formatOn = field.options.formatOn;
        
        if (field.type === 'input' && event.type === formatOn) {
            fields[changedFieldIdx].value = formatter(event.target.value);
        } else {
            fields[changedFieldIdx].value = event.target.value;
        }

        if (currentFieldIdx > changedFieldIdx) {
            const currentSection = this.state.currentSection;
            for (let i = currentFieldIdx; i < fields.length; i++) {
                if (fields[i].section !== currentSection) { break; }
                if (this.isFieldDependency(fields[i].options.dependencies, field)) {
                    fields[i].value = "";
                }
            }
        }
        
        this.setState({
            fields, 
            currentSection: this.changeSection(changedFieldIdx),
            currentField: changedFieldIdx
        });
    }

    getFieldIndex = name => {
        const indices = this.state.indices;
        return indices[name];
    }

    changeSection = (currentIndex) => {
        const fields = this.state.fields;
        const currentSection = this.state.currentSection;
        const nextField = fields[currentIndex + 1];

        if (!nextField || nextField.section === currentSection) {
            return currentSection;
        } else if (nextField.section > currentSection) {
            return nextField.section;
        } else if (!this.isDependencyMet(nextField)) {
            return nextField.section + 1;
        }
    }

    /**
     *  TODO: ADD TO PROPTYPES:
     *  @param field.options.dependencies - must be an array with objects of 
     *      {
     *          callback: func returns a boolean,
     *          name: name of the field as a dependency
     *      }
     */
    isDependencyMet = dependent => {
        if (!dependent.options.dependencies.length) { return true }
        return dependent.options.dependencies.every(dependency => {
            const index = this.getFieldIndex(dependency.name);
            const dependencyField = this.state.fields[index];
            return dependency.callback(dependencyField.value);
        });
    }

    isFieldDependency = (dependencies, field) => {
        return dependencies.some(dependency => {
            return dependency.name === field.name;
        });
    }

    filterFieldItems = field => {
        //console.log(`\n[filterFieldItems]`);
        const filterField = field.options.filterByField.name;
        const fieldFilterValue = this.state.fields[this.getFieldIndex(filterField)].value;
        const callback = field.options.filterByField.callback;

        return field.items.filter(item => callback(item, fieldFilterValue));;
    }

    /**
     * Expected return from props.submitForm callback:
     * {
     *      ok: boolean,
     *      body: {
     *          message: String,
     *          invalidFields: array of Strings - names of fields that are invalid
     *      }
     * }
     */
    submitForm = async () => {
        let submitValues = {};
        const fields = [...this.state.fields];

        fields.forEach(field => {
            submitValues[field.name] = field.value;
        });

        const response = await this.props.submitForm(submitValues);

        if (!response.ok) {
            response.body.invalidFields.forEach(invalidField => {
                const invalidIdx = this.getFieldIndex(invalidField);
                fields[invalidIdx].isValid = false;
            });
            this.setState({fields, message: response.body.message});
        } else {
            this.setState({shouldReset: !this.props.reset, message: response.body.message});
        }
    }

    render() {
        let currentSection = this.state.currentSection;

        let fields = this.state.fields.map((field, index) => {
            const tempField = {...field};
            if (tempField.section <= currentSection) {
                const isVisible = this.isDependencyMet(tempField);
                if (isVisible) {
                    if (tempField.options.filterByField) {
                        tempField.items = this.filterFieldItems(tempField);
                    }
                    
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
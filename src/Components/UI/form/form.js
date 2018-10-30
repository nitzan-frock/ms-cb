import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Field from './field';
import Button from '../../UI/button/button';

import './form.scss';

export default class Form extends Component{
    constructor(props) {
        super(props);
        this.state = {
            currentSection: 0,
            sections: [],
            message: "",
            shouldReset: false
        }
    }

    componentDidMount() {
        console.log(`[cdm]`);
        console.log(this.props.sections);
        let sections = [];

        this.props.sections.forEach(section => {
            sections.push({
                fields: section.fields.map(field => this.buildField(field))
            });
        });
        console.log(`sections created`);
        console.log(sections);

        this.setState({sections});
    }

    componentDidUpdate() {
        console.log(`[componentDidUpdate]`);
        if (this.props.reset !== this.state.shouldReset) {
            this.setState(prevState => {
                const sections = prevState.sections;
                sections.forEach(section => {
                    section.fields.forEach(field => {
                        field.value = "";
                    });
                });
                console.log(sections);

                const shouldReset = !prevState.shouldReset;

                return {sections, shouldReset};
            })
        }
    }

    // Initialization helper functions

    buildField = field => {
        field.options = this.setFieldOptions(field);
        return {
            ...field,
            value: "",
            invalidEntry: ""
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

    fieldChanged = (event, field, sectionIndex, fieldIndex) => {
        event.preventDefault();
        const sections = this.state.sections;
        const formatter = field.options.formatter;
        
        if (field.options.formatOn === event.type && formatter) {
            field.value = formatter(event.target.value);
        } else {
            field.value = event.target.value;
        }

        sections[sectionIndex].fields[fieldIndex] = field;

        this.setState({sections});
    }

    submitForm = async () => {
        let submitValues = {};
        const fields = this.state.fields;

        Object.keys(fields).map(field => {
            submitValues[field] = fields[field].value;
        });

        const response = await this.props.submitForm(submitValues);

        if (!response.ok) {
            response.body.invalidFields.forEach(field => {
                if (field === "all") {
                    Object.keys(fields).map(field => {
                        fields[field].invalidEntry = true;
                    });
                } else {
                    fields[field].invalidEntry = true;
                }
            });
            this.setState({fields, message: response.body.message});
        } else {
            this.setState({shouldReset: !this.props.reset})
        }
    }

    render() {
        let fields = [];
        const sectionIndex = this.state.currentSection;

        console.log(this.state.sections[sectionIndex]);

        if (this.state.sections[sectionIndex]) {
            this.state.sections[sectionIndex].fields.forEach((field, index) => {
                console.log(field);
                fields.push(
                    <Field 
                        key={index}
                        field={field}
                        invalidEntry={this.props.invalidEntry}
                        value={field.value}
                        changed={(e) => this.fieldChanged(e, field, sectionIndex, index)} />
                );
            });
        }

        return (
            <>
                <div className="form">
                    {fields}
                    <Button clicked={this.submitForm} >Submit</Button>
                </div>
            </>
        );
    }
};

const field = PropTypes.object.isRequired;
const section = PropTypes.shape({
    fields: PropTypes.arrayOf(field).isRequired
});

Form.propTypes = {
    sections: PropTypes.arrayOf(section).isRequired
}
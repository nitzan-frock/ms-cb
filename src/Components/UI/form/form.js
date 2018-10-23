import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Field from './field';
import Button from '../../UI/button/button';

import './form.scss';

export default class Form extends Component{
    constructor(props) {
        super(props);
        this.state = {
            fields: {},
            message: "",
            shouldReset: false
        }
    }

    componentDidMount() {
        const fields = {};
        this.props.fields.forEach(field => {
            let formatter = input => input ;
            let formatOn = 'change';

            if (field.options) {
                formatter = field.options.formatter;
                formatOn = field.options.formatOn;
            }

            fields[field.name] = {
                value: "",
                formatter,
                formatOn,
                invalidEntry: false
            }
        });
        this.setState({fields});
    }

    componentDidUpdate() {
        if (this.props.reset !== this.state.shouldReset) {
            this.setState(prevState => {
                const fields = prevState.fields;
                Object.keys(fields).forEach(field => {
                    fields[field].value = "";
                });

                const shouldReset = !prevState.shouldReset;

                return {fields, shouldReset};
            })
        }
    }

    formatInput = (event, fieldName) => {
        event.preventDefault();
        const fields = this.state.fields;
        const formatter = fields[fieldName].formatter;
        
        if (fields[fieldName].formatOn === event.type && formatter) {
            fields[fieldName].value = formatter(event.target.value);
        } else {
            fields[fieldName].value = event.target.value;
        }
        this.setState({fields});
    }

    submitForm = async () => {
        let submitValues = {};
        const fields = this.state.fields;

        Object.keys(fields).map(field => {
            submitValues[field] = fields[field].value;
        });

        const response = await this.props.submitForm(submitValues);
        console.log(response);

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
            console.log(fields);
            this.setState({fields, message: response.body.message});
        } else {
            console.log(this.props.reset, this.state.shouldReset);
            this.setState({shouldReset: !this.props.reset})
        }
    }

    render() {
        let fields = null;
        if (Object.keys(this.state.fields).length) {
            fields = this.props.fields.map((field, index) => {
                return (
                    <Field
                        key={index}
                        name={field.name}
                        maxLength={field.maxLength}
                        placeholder={field.placeholder}
                        invalidEntry={this.state.fields[field.name].invalidEntry}
                        value={this.state.fields[field.name].value}
                        options={field.options}
                        formatInput={(e) => this.formatInput(e, field.name)} />
                );
            })
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

Form.propTypes = {
    fields: PropTypes.arrayOf(PropTypes.shape(
        {

        }
    ))
}
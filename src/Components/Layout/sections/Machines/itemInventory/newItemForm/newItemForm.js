import React, { Component } from 'react';

import Form from '../../../../../UI/form/form';
import Field from '../../../../../UI/form/field';
import Button from '../../../../../UI/button/button';


export default class newItemForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            fields: {},
            shouldReset: false
        }
    }

    componentDidMount() {
        const fields = {};
        this.props.fields.forEach((field, index) =>{
            fields[field.name] = {
                value: ""
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

    // formatInput = (event, field) => {
    //     event.preventDefault();
    //     const fields = this.state.fields;
    //     const formatter;
    // }

    onFieldChanged = (event, field) => {
        event.preventDefault();
        const fields = this.state.fields;
        const formatter = field.options.formatOnChange;
        if (formatter) {
            fields[field.name].value = formatter(event.target.value);
        } else {
            fields[field.name].value = event.target.value;
        }
        this.setState({fields});
    }

    onUnfocus = (event, field) => {
        event.preventDefault();
        const fields = this.state.fields;
        const formatter = field.options.formatOnEnter;
        if (formatter) {
            fields[field.name].value = formatter(event.target.value);
        } else {
            fields[field.name].value = event.target.value;
        }
        this.setState({fields});
    }

    submitForm = () => {
        let values = {};
        const fields = this.state.fields;
        Object.keys(fields).map(field => {
            values[field] = fields[field].value;
        });
        this.props.submitForm(values);
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
                        invalidEntry={this.props.invalidEntry}
                        value={this.state.fields[field.name].value}
                        changed={(e) => this.onFieldChanged(e, field)}
                        unfocus={(e) => this.onUnfocus(e, field)} />
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
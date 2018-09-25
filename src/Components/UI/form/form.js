import React, { Component } from 'react';

import Button from '../../UI/button/button';

import './form.scss';

export default class Form extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.children !== this.props.children;
    }

    render() {
        return (
            <div className="form">
                {this.props.children}
                <Button clicked={this.props.submitForm} >{this.props.buttonName}</Button>
            </div>
        );
    }
}
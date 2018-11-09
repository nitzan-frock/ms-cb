import React from 'react';
import uuid from 'uuid/v1';
import PropTypes from 'prop-types';

const selection = (props) => {
    return (
        <select
            value={props.value ? props.value : props.defaultValue}
            onChange={props.changed}>
            {props.defaultValue ? <option disabled>{props.defaultValue}</option> : null}
            {props.items.map(item => {
                return (
                    <option key={uuid()} value={item.value ? item.value : item.displayName}>{item.displayName}</option>
                );
            })}
        </select>
    );
};

selection.propTypes = {
    defaultValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    changed: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
        displayName: PropTypes.string.isRequired
    }))
}

export default selection;
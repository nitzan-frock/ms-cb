import React from 'react';
import uuid from 'uuid/v1';
import PropTypes from 'prop-types';

import StringManipulator from '../../../tools/stringManipulator/StringManipulator';

const selection = (props) => {
    return (
        <select
            value={props.selectedItem ? props.selectedItem : props.defaultValue}
            onChange={props.onSelectionChanged}>
            {props.defaultValue ? <option disabled>{props.defaultValue}</option> : null}
            {props.items.map(item => {
                const itemName = item === 'OEM' ? item : StringManipulator.toTitleCase(item);
                return (
                    <option key={uuid()} value={item}>{itemName}</option>
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
    onSelectionChanged: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default selection;
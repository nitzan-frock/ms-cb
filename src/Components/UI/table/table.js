import React from 'react';
import PropTypes from 'prop-types';
import StringManipulator from '../../../tools/stringManipulator/StringManipulator';

const table = (props) => {
    return (
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        {props.headers.map((header, index) => {
                            return <th key={index}>{header.name}</th>;
                        })}
                    </tr>
                    {props.items.map((item, index) => {
                        return (
                            <tr key={index}>
                                {props.headers.map((header, index) => {
                                    let val = header.accessor === 'mac' 
                                        ? StringManipulator.MACAddressFormatter(item[header.accessor]) 
                                        : item[header.accessor];
                                    return <td key={index}>{val}</td>
                                })}
                            </tr>
                        );
                    })}
                </thead>
            </table>
        </div>
    );
};

export default table;

table.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired
}
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import StringManipulator from '../../../tools/stringManipulator/StringManipulator';
import Pagination from '../../UI/pagination/Pagination';

export default class Table extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
            showItems: [],
            totalPages: 1,
            itemsPerPage: 10,
            filters: {},
            prevItems: [],
            prevSelectedItem: undefined
        }
    }

    componentDidMount() {
        const data = this.props.data;
        const showItems = data.slice(0, this.state.itemsPerPage);
        // TODO: initialize filters for headers
        this.setState({ showItems })
    }

    static getDerivedStateFromProps(props, state) {
        if (props.selectedItem !== state.prevSelectedItem) {
            let items = props.data.slice(0, state.itemsPerPage);
            return {
                prevSelectedItem: props.selectedItem,
                showItems: items
            }
        } else if (JSON.stringify(props.data) !== JSON.stringify(state.prevItems)) {
            const offset = (state.currentPage - 1) * state.itemsPerPage;
            const showItems = props.data.slice(offset, offset + state.itemsPerPage);
            return {
                showItems: showItems,
                prevItems: props.data
            }
        }
        return null;
    }

    refreshShownData = data => {
        const items = this.props.data;
        const { currentPage, itemsPerPage } = data;

        const offset = (currentPage - 1) * itemsPerPage;
        const showItems = items.slice(offset, offset + itemsPerPage);
        return showItems;
    }

    onPageChanged = data => {
        const { currentPage, totalPages } = data;
        const showItems = this.refreshShownData(data);
        this.setState({ currentPage, showItems, totalPages });
    }

    render() {
        let data = this.props.data;

        return (
            <div className="table-container">
                <Pagination
                    totalRecords={this.props.data.length}
                    currentPage={this.state.currentPage}
                    pageNeighbors={1}
                    itemsPerPage={this.state.itemsPerPage}
                    onPageChanged={this.onPageChanged} />
                <table className="table">
                    <thead>
                        <tr>
                            {this.props.headers.map((header, index) => {
                                return ( 
                                    <th key={index}>
                                        <input value={this.state.filters} placeholder={header.name}/>
                                        {header.name}
                                    </th>
                                );
                            })}
                        </tr>
                        {this.state.showItems.map((item, index) => {
                            return (
                                <tr key={index}>
                                    {this.props.headers.map((header, index) => {
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
}

Table.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired
}
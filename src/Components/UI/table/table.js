import React, { Component } from 'react';
import PropTypes from 'prop-types';

import StringManipulator from '../../../tools/stringManipulator/StringManipulator';
import Pagination from '../../UI/pagination/Pagination';

export default class Table extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
            shownItems: [],
            totalPages: 1,
            itemsPerPage: 10,
            filters: {},
            filteredItems: [],
            prevItems: [],
            prevSelectedItem: undefined
        }
    }

    componentDidMount() {
        const data = this.props.data;
        const shownItems = data.slice(0, this.state.itemsPerPage);
        this.setState({ shownItems, filteredItems: data })
    }

    static getDerivedStateFromProps(props, state) {
        let newState = {};
        if (Object.keys(state.filters).length === 0) {
            newState.filters = {};
            props.headers.forEach(header => {
                newState.filters[header.accessor] = "";
            });
        }

        if (props.selectedItem !== state.prevSelectedItem) {
            let items = props.data.slice(0, state.itemsPerPage);
            newState.prevSelectedItem = props.selectedItem;
            newState.filteredItems = props.data;
            newState.shownItems = items;
        }

        if (props.refresh) {
            newState.filteredItems = props.data;
            newState.shownItems = props.data.slice(0, state.itemsPerPage);
        }

        return Object.keys(newState).length > 0 ? newState : null;
    }

    getShownData = data => {
        let { currentPage, itemsPerPage, items } = data;
        if (!items) items = this.state.filteredItems;
        const offset = (currentPage - 1) * itemsPerPage;
        const shownItems = items.slice(offset, offset + itemsPerPage);
        return shownItems;
    }

    onPageChanged = data => {
        const { currentPage, totalPages } = data;
        const shownItems = this.getShownData(data);
        this.setState({ currentPage, shownItems, totalPages });
    }

    onFilterChanged = (event, filter) => {
        event.preventDefault();

        const filters = this.state.filters;
        filters[filter] = event.target.value;

        const filteredItems = this.filterData(this.props.data, filters);
        const itemsPerPage = this.state.itemsPerPage;
        const currentPage = 1;
        const shownItems = this.getShownData({ currentPage, itemsPerPage, items: filteredItems });

        this.setState({filters, filteredItems, shownItems});
    }

    filterData = (data, filters) => {
        return data.filter(item => {
            const isMatch = Object.keys(filters).every(key => {
                if (item[key]) {
                    let filter = filters[key];

                    if (key === 'mac') filter = filter.replace(/[^a-f0-9]/ig, "");
                    if (!filter) return true;

                    const exp = `^${filter}.*`;
                    const regEx = new RegExp(exp, 'ig');

                    let isMatchedToFilter = false;

                    if (Array.isArray(item[key])) {
                        if (item[key].length !== 0) {
                            const names = item[key].map(sub => sub.displayName);
                            isMatchedToFilter = names.every(name => {
                                if (name) {
                                    return name.match(regEx) ? true : false;
                                }
                                return false;
                            });
                            return isMatchedToFilter;
                        }
                        return isMatchedToFilter;
                    }
                    isMatchedToFilter = item[key].match(regEx) ? true : false;
                    return isMatchedToFilter;
                }
            });
            return isMatch ? item : null;
        });
    }

    render() {
        return (
            <div className="table-container">
                <Pagination
                    totalRecords={this.state.filteredItems.length}
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
                                        <input 
                                            name={header.accessor}
                                            value={this.state.filters[header.accessor]} 
                                            onChange={(event) => this.onFilterChanged(event, header.accessor)}
                                            placeholder={header.name}/>
                                        {header.name}
                                    </th>
                                );
                            })}
                        </tr>
                        {this.state.shownItems.map((item, index) => {
                            return (
                                <tr key={index}>
                                    {this.props.headers.map((header, index) => {
                                        let val = header.accessor === 'mac'
                                            ? StringManipulator.MACAddressFormatter(item[header.accessor])
                                            : Array.isArray(item[header.accessor])
                                            ? item[header.accessor].map(item => item.displayName).join(", ")
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
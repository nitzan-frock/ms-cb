import React, { Component } from 'react';
import PropTypes from 'prop-types';

import StringManipulator from '../../../tools/stringManipulator/StringManipulator';
import Selection from '../../UI/selection/selection';
import Pagination from '../../UI/pagination/Pagination';

export default class Table extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
            showItems: [],
            totalPages: 1,
            itemsPerPage: 10,
            prevItems: [],
            prevSelectedItem: undefined
        }
    }

    static getDerivedStateFromProps(props, state) {
        console.log('get derived state from props');
        if (props.selectedItem !== state.prevSelectedItem) {
            let items = props.data.slice(0, state.itemsPerPage);
            console.log(`new item`);
            console.log(props.data);
            console.log(items);
            return {
                showItems: items
            }
        } else if (JSON.stringify(props.data) !== JSON.stringify(state.prevItems)) {
            console.log('update items');
            const offset = (state.currentPage - 1) * state.itemsPerPage;
            const showItems = props.data.slice(offset, offset + state.itemsPerPage);
            return {
                showItems: showItems,
                prevItems: props.data
            }
        }
        return null;
    }

    componentDidMount() {
        const data = this.props.data;
        const showItems = data.slice(0, this.state.itemsPerPage);
        this.setState({ showItems })
    }

    componentDidUpdate(prevProps) {
        
        // } else if (this.props.refresh) {
        //     console.log(this.props.refresh);
        //     console.log(`table needs to be refreshed.`);
        //     // const showItems = 
        //     // this.setState({showItems});
        // }
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
                                return <th key={index}>{header.name}</th>;
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
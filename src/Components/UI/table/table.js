import React, { Component } from 'react';
import PropTypes from 'prop-types';

import StringManipulator from '../../../tools/stringManipulator/StringManipulator';
import Selection from '../../UI/selection/selection';
import Pagination from '../../UI/pagination/Pagination';

export default class Table extends Component {
    constructor(props){
        super(props);

        this.state = {
            currentPage: 1,
            currentItems: [],
            totalPages: 1,
            itemsPerPage: 10
        }
    }

    componentDidMount() {
        const data = this.props.data;
        const currentItems = data.slice(0, this.state.itemsPerPage);
        this.setState({currentItems})
    }

    componentDidUpdate(prevProps) {
        if (prevProps.selectedItem !== this.props.selectedItem) {
            let items = this.props.data.slice(0, this.state.itemsPerPage);
            this.setState({currentItems: items})
        }
    }

    onPageChanged = data => {
        const items = this.props.data;
        const { currentPage, totalPages, itemsPerPage } = data;

        const offset = (currentPage - 1) * itemsPerPage;
        const currentItems = items.slice(offset, offset + itemsPerPage);

        this.setState({currentPage, currentItems, totalPages});
    }

    render(){
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
                        {this.state.currentItems.map((item, index) => {
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
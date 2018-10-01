import React, { Component } from 'react';

import Pagination from '../../../../../UI/pagination/Pagination';
import DataTools from '../../../../../../data/DataTools';

export default class ItemList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalRecords: 0,
            pageLimit: 10,
            pageNeighbors: 2,
            itemsPerPage: null
        }
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.selectedItem !== this.props.selectedItem) {
            let items;
            if (!this.props.selectedItem) return;
            else if (this.props.selectedItem === this.props.itemSelection.DATAHUBS) {
                items = await DataTools.getDatahubs(this.props.companyId);
            } else if (this.props.selectedItem === this.props.itemSelection.SENSORS) {
                items = await DataTools.getSensors(this.props.companyId);
            } else {
                items = ['oems'];
            }
            this.setState({totalRecords: items.length})
        }
    }

    onPageChanged = data => {
        const { selectedItem } = this.props;
        const items = this.state[selectedItem];
        const { currentPage, totalPages, itemsPerPage } = data;

        const offset = (currentPage - 1) * itemsPerPage;
        const currentItems = items.slice(offset, offset + itemsPerPage);

        this.setState({currentPage, currentItems, totalPages});
    }

    render() {
        return (
            <>
                <Pagination 
                    totalRecords={this.state.totalRecords}
                    pageLimit={this.state.pageLimit}
                    pageNeighbors={this.state.pageNeighbors}
                    itemsPerPage={this.state.itemsPerPage}
                    handleClick={this.onPageChanged} />
            </>
        );
    }
}
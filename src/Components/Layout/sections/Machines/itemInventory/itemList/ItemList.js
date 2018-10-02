import React, { Component } from 'react';

import Pagination from '../../../../../UI/pagination/Pagination';
import DataTools from '../../../../../../data/DataTools';
import Table from '../../../../../UI/table/table';

import './itemList.scss';

export default class ItemList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            totalRecords: 0
        }
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.selectedItem !== this.props.selectedItem) {
            const { itemSelections } = this.props;
            const { selectedItem } = this.props;

            const items = selectedItem === itemSelections.DATAHUBS
                ? await DataTools.getDatahubs(this.props.companyId)
                : selectedItem === itemSelections.SENSORS
                ? await DataTools.getSensors(this.props.companyId) : itemSelections.OEM;

            console.log('records ' +items.length);
            this.setState({totalRecords: items.length, items: items})
        }
    }

    onPageChanged = async data => {
        const items = this.state.items;
        const { currentPage, totalPages, itemsPerPage } = data;

        const offset = (currentPage - 1) * itemsPerPage;
        console.log(currentPage);
        console.log(itemsPerPage);
        console.log(offset);
        const currentItems = items.slice(offset, offset + itemsPerPage);

        this.setState({currentPage, currentItems, totalPages});
    }

    render() {
        const serial = {name: 'Serial Number', accessor: 'serial'};
        const mac = {name: 'MAC Address', accessor: 'mac'};
        const location = {name: 'Location', accessor: 'locationId'};
        const tableHeaders = [serial, mac, location];

        return (
            <>
                {this.props.selectedItem === undefined ? 'Please select an item': 
                    <div className="item-list">
                        <Pagination 
                            totalRecords={this.state.totalRecords}
                            pageNeighbors={1}
                            onPageChanged={this.onPageChanged} />
                        <p>list of items</p>
                        <Table items={this.state.items} headers={tableHeaders}/>
                    </div>
                }
            </>
        );
    }
}
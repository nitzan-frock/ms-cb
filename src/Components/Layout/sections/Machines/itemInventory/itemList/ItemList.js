import React, { Component } from 'react';

import Pagination from '../../../../../UI/pagination/Pagination';
import DataTools from '../../../../../../data/DataTools';
import Table from '../../../../../UI/table/Table';
import Selection from '../../../../../UI/selection/selection';

import './itemList.scss';

const DATAHUBS = 'DATAHUBS';
const SENSORS = 'SENSORS';
const OEM = 'OEM'; 

export default class ItemList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            selectedItem: undefined,
        }
    }

    // async componentDidUpdate(prevProps, prevState) {
    //     console.log(`\nItem list updated...`);
    //     console.log(`selected item changed? ${prevState.selectedItem !== this.state.selectedItem}`);
    //     if (prevState.selectedItem !== this.state.selectedItem) {
    //         const { selectedItem } = this.state;
    //         const items = await this.updateItems(selectedItem);
    //         console.log(items);
    //         this.setState({items: items});
    //         console.log(`set state for items in [ItemList]`);
    //     }
    // }

    updateItems = async (type) => {
        let items;
        if (type === DATAHUBS) {
            items = await DataTools.getDatahubs(this.props.companyId);
        } else if (type === SENSORS) {
            items = await DataTools.getSensors(this.props.companyId)
        } else if (type === OEM) {
            items = [OEM];
        }
        return items
    }

    onSelectionChanged = async (event) => {
        event.preventDefault();
        const selection = event.target.value;
        const items = await this.updateItems(selection);
        console.log(items);
        this.setState({selectedItem: selection, items: items});
    }

    render() {
        const itemSelections = [DATAHUBS, SENSORS, OEM];
        const defaultSelectionValue = "Select A Product";

        // headers
        const tableHeaders = [
            {name: 'Serial Number', accessor: 'serial'},
            {name: 'MAC Address', accessor: 'mac'},
            {name: 'Location', accessor: 'locationId'},
            {name: 'Machine', accessor: 'machineId'}
        ]

        let table = null;
        if (this.state.items.length !== 0) {
            table = (
                <Table 
                    filter={this.state.filter} 
                    selectedItem={this.state.selectedItem}
                    data={this.state.items} 
                    headers={tableHeaders} />
            );
        }
        
        return (
            <>
                <Selection
                    defaultValue={defaultSelectionValue}
                    selectedItem={this.state.selectedItem}
                    onSelectionChanged={this.onSelectionChanged}
                    items={itemSelections} />
                {
                    this.state.selectedItem === undefined 
                        ? 'Please select an item' 
                        : this.state.items.length !== 0 
                            ? (
                                <div className="item-list">
                                    {table}
                                </div>
                            ) 
                            : null
                }
            </>
        );
    }
}
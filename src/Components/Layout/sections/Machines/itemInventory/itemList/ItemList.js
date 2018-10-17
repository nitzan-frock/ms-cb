import React, { Component } from 'react';

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
            items: null,
            selectedItem: undefined,
            loading: true
        }
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.refresh !== this.props.refresh){
            console.log(`refresh item list: ${this.props.refresh}`);
            const items = await this.updateItems(this.state.selectedItem);
            this.setState({items});
        }
    }

    updateItems = async (type) => {
        let items = [];
        if (type === DATAHUBS) {
            items = await DataTools.getDatahubs(this.props.companyId);
        } else if (type === SENSORS) {
            items = await DataTools.getSensors(this.props.companyId);
        } else if (type === OEM) {
            items = [OEM];
        }
        return items;
    }

    onSelectionChanged = async (event) => {
        event.preventDefault();
        const selection = event.target.value;
        const items = await this.updateItems(selection);
        this.setState({ selectedItem: selection, items: items, loading: false});
    }

    render() {
        const itemSelections = [DATAHUBS, SENSORS, OEM];
        const defaultSelectionValue = "Select A Product";

        const tableHeaders = [
            { name: 'Serial Number', accessor: 'serial' },
            { name: 'MAC Address', accessor: 'mac' },
            { name: 'Location', accessor: 'location' },
            { name: 'Machines', accessor: 'machines' }
        ]

        let table = null;

        if (this.state.items) {
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
                        : this.state.items
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
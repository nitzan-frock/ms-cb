import React, { Component } from 'react';

import ItemInventory from './itemInventory/ItemInventory';
import MachinesOrganizer from './machinesOrganizer/machinesOrganizer';
import DataTools from '../../../../data/DataTools';

export default class Machines extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locations: [],
            zones: [],
            machines: [],
            sensors: [],
            datahubs: []
        }
    }

    componentDidMount() {
        const company_id = this.props.activeCompany;
        const locations = await DataTools.getLocations({company_id});
        const datahubs = await DataTools.getDatahubs({company_id})
    }

    render() {
        return (
            <>
                <ItemInventory {...this.props}/>
                <MachinesOrganizer {...this.props} />
            </>
        );
    }
}
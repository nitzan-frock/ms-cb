import React, { Component } from 'react';

import ItemInventory from './itemInventory/ItemInventory';
import MachinesOrganizer from './machinesOrganizer/machinesOrganizer';
import DataTools from '../../../../data/DataTools';

export default class Machines extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locations: [],
            machines: [],
            sensors: [],
            datahubs: [],
            loading: true
        }
    }

    componentDidMount() {
        const company_id = this.props.activeCompany;
        const locations = await DataTools.getLocations({company_id});
        const machines = await DataTools.getMachines({company_id});
        const sensors = await DataTools.getSensors({company_id});
        const datahubs = await DataTools.getDatahubs({company_id});
        
        this.setState({
            locations,
            machines,
            sensors,
            datahubs,
            loading: false
        });
    }

    

    render() {
        return (this.state.loading 
            ? <p>Loading...</p>
            : (
                <>
                <ItemInventory {...this.props} 
                    machines={this.state.machines} 
                    sensors={this.state.sensors} 
                    datahubs={this.state.datahubs}/>
                <MachinesOrganizer {...this.props}
                    locations={this.state.location}
                    sensors={this.state.sensors}
                    machines={this.state.machines}
                    datahubs={this.state.datahubs} />
                    </>
            )
        );
    }
}
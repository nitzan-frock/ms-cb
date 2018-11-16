import React, { Component } from 'react';
import {hot} from 'react-hot-loader';

import DataTools from './data/DataTools';
import Header from './Components/Layout/header/header';
import Section from './Components/Layout/sections/section';

import './main.scss';

// tabs
const RESOURCES = 'RESOURCES';
const MACHINES = 'MACHINES';
const DATA_MONITOR = 'DATA MONITOR';

class App extends Component{
    constructor(props){
        super(props);
        this.state = {
            loginSuccess: true,
            activeTab: MACHINES,
            activeCompany: undefined,
            activeUser: undefined
        }
    }

    async componentDidMount() {
        // activeUser should be passed in as a prop on login.
        const activeUser = await DataTools.getUser(3);
        const activeCompany = await DataTools.getCompany(2);
        this.setState({activeCompany, activeUser});
    }

    componentDidUpdate

    tabClickedHandler = (name) => {
        this.setState({
            activeTab: name
        });
    }

    render(){
        const tabs = [RESOURCES, MACHINES, DATA_MONITOR];
        return (
            <div className="App">
                <Header tabs={tabs} activeTab={this.state.activeTab} tabClicked={this.tabClickedHandler}/>
                {
                    this.state.activeCompany 
                    ? <Section 
                        activeTab={this.state.activeTab} 
                        activeUser={this.state.activeUser} 
                        activeCompany={this.state.activeCompany} />
                    : null
                }
            </div>
        )
    }
}

export default hot(module)(App);
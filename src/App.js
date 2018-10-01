import React, { Component } from 'react';
import {hot} from 'react-hot-loader';

import DataTools from './data/DataTools';
import Header from './Components/Layout/header/header';
import Section from './Components/Layout/sections/section';

import './main.scss';

const RESOURCES = 'RESOURCES';
const MACHINES = 'MACHINES';
const DATA_MONITOR = 'DATA MONITOR';

class App extends Component{
    constructor(props){
        super(props);
        this.state = {
            loginSuccess: true,
            activeTab: MACHINES,
            activeUser: null
        }
    }

    async componentDidMount() {
        const user = await DataTools.getUser(1);
        this.setState({ activeUser: user });
    }

    tabClickedHandler = (name) => {
        this.setState({
            activeTab: name.toLowerCase()
        });
    }

    render(){
        const tabs = [RESOURCES, MACHINES, DATA_MONITOR];
        return (
            <div className="App">
                <Header tabs={tabs} activeTab={this.state.activeTab} tabClicked={this.tabClickedHandler}/>
                {
                    this.state.activeUser 
                    ? <Section activeTab={this.state.activeTab} activeUser={this.state.activeUser} />
                    : null
                }
            </div>
        )
    }
}

export default hot(module)(App);
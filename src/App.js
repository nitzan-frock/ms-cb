import React, { Component } from 'react';
import {hot} from 'react-hot-loader';

import DataRetriever from './data/DataRetriever';
import Header from './Components/Layout/header/header';
import Section from './Components/Layout/sections/section';

import './main.scss';

class App extends Component{
    constructor(props){
        super(props);
        this.state = {
            loginSuccess: true,
            activeTab: "resources",
            activeUser: null
        }
        this.tabClickedHandler = this.tabClickedHandler.bind(this);
    }

    async componentDidMount() {
        const user = await DataRetriever.getUser('user1');
        console.log(user);
        this.setState({ activeUser: user });
    }

    tabClickedHandler(name){
        this.setState({
            activeTab: name.toLowerCase()
        });
    }

    render(){
        return(            
            <div className="App">
                <Header activeTab={this.state.activeTab} tabClicked={this.tabClickedHandler}/>
                <Section activeTab={this.state.activeTab} activeUser={this.state.activeUser} />
            </div>
        )
    }
}

export default hot(module)(App);
import React, { Component } from 'react';
import {hot} from 'react-hot-loader';

import Header from './Components/Layout/header/header';

import './main.scss';

class App extends Component{
    constructor(props){
        super(props);
        this.state = {
            activeTab: "Resources"
        }
    }

    tabClickedHandler(name){
        this.setState(() => ({
            activeTab: "Machines"
        }));
    }

    render(){
        console.log(this.state.activeTab);
        return(            
            <div className="App">
                <Header activeTab={this.state.activeTab} tabClicked={this.tabClickedHandler}/>
            </div>
        )
    }
}

export default hot(module)(App);
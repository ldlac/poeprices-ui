import React, { Component } from 'react';
import Toolbar from './toolbar.js';
import base64 from 'base-64';
import utf8 from 'utf8';
import fetch from 'node-fetch';
import './App.css';
import './css/scrollbar.css';

// import logo from './logo.svg';

let isDev, electron, ipc, remote;
if(window.process !== undefined) {
  isDev = window.require('electron-is-dev');
  electron = window.require('electron');
  ipc = electron.ipcRenderer;
  remote = electron.remote;
}
// const electron_process = electron.process;
// const electron_app = electron.app;

class App extends Component {
  state = {
    loading: false,
    itemInfo: "",
    itemInfoCurrency: "",
    itemInfoMin: "",
    itemInfoMax: "",
    itemInfoError: "",
    maximized: false,
  };

  componentDidMount() {
    if(window.process !== undefined) {
      ipc.on('pricecheck', (event, itemInfo) => {
        console.log("ok");
        this.setState({
          loading: true
        })
        console.log(encoded);
        let bytes = utf8.encode(itemInfo);
        let encoded = base64.encode(bytes);
        fetch('https://www.poeprices.info/api?l=Incursion&i='+encoded)
        .then(res => res.json())
        .then(json => this.setState({
          itemInfo: itemInfo,
          itemInfoCurrency: json.currency,
          itemInfoMin: json.min,
          itemInfoMax: json.max,
          itemInfoError: json.error,
          loading: false
        }));
        // let info = JSON.parse('{"currency": "chaos", "max": 19.32, "min": 12.880000000000003, "error": 0}');
        // this.setState({
        //   itemInfo: itemInfo,
        //   itemInfoCurrency: info.currency,
        //   itemInfoMin: info.min,
        //   itemInfoMax: info.max,
        //   itemInfoError: info.error,
        // })
      });
    }
  }

  onToolbarClick = e => {
    switch(e) {
      case "close":
        remote.getCurrentWindow().close();
        break;
      case "maximize":
        if (!this.state.maximized) {
          remote.getCurrentWindow().maximize();
          this.setState({
            maximized: true
          });
        } else {
          this.setState({
            maximized: false
          });
          remote.getCurrentWindow().unmaximize();
        }
        break;
      case "minimize":
        remote.getCurrentWindow().minimize();
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <div className="App">
        <Toolbar onClick={this.onToolbarClick}/>
        <div className="Content">
          {
            !this.state.loading ?
            <div>
            <span>{this.state.itemInfo}</span><br/>
            <span>{this.state.itemInfoCurrency}</span><br/>
            <span>{this.state.itemInfoMin}</span><br/>
            <span>{this.state.itemInfoMax}</span><br/>
            <span>{this.state.itemInfoError}</span><br/></div> : <div><span>Loading ...</span></div>
          }
        </div>
      </div>
    );
  }
}

export default App;

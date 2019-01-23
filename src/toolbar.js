import React, { Component } from 'react';
import Close from 'react-icons/lib/md/close'
import Maximize from 'react-icons/lib/md/fullscreen'
import Minimize from 'react-icons/lib/md/remove'
import Sep from 'react-icons/lib/md/chevron-right'
import './css/toolbar.css';

class Toolbar extends Component {
  close = e => this.props.onClick("close");
  maximize = e => this.props.onClick("maximize");
  minimize = e => this.props.onClick("minimize");

  render() {
    return (
      <div className="toolbar">
        <div className="toolbar-left">
        </div>
        <div className="toolbar-right">
          <Minimize width="22" height="22" onClick={this.minimize}/>
          <Maximize width="22" height="22" onClick={this.maximize}/>
          <Close width="22" height="22" onClick={this.close}/>
        </div>
      </div>
    );
  }
}

export default Toolbar;

import React, {Component, Fragment} from "react";
import {connect} from "react-redux";

const websiteIntegrationBarWrapperStyles = {
  position: 'fixed',
  zIndex: '2147483647',
  display: 'block',
  top: 0,
  left: 0,
  width: '330px',
  height: '100vh'
};

const websiteIntegrationBarStyles = {
  position: 'relative',
  border: 'none',
  height: '100%',
  width: '100%',
  visibility: 'visible'
};

@connect(store => ({
  websiteIntegrationBar:  store.websiteIntegrationBar
}))
class WebsiteIntegrationBar extends Component {
  constructor(props){
    super(props);
  }
  render(){
    const wib = this.props.websiteIntegrationBar[this.props.tabId];
    if (!wib)
      return null;
    return (
        <div style={websiteIntegrationBarWrapperStyles}>
          <iframe style={websiteIntegrationBarStyles}
                  src={browser.runtime.getURL('pages/background-ui.html#/websiteIntegrationBar')}>
          </iframe>
        </div>
    );
  }
}

export default WebsiteIntegrationBar;
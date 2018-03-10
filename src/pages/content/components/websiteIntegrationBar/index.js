import React, {Component, Fragment} from "react";
import {MessageResponse} from "../../../../shared/utils";
import {select} from "optimal-select";
import {connect} from "react-redux";

const websiteIntegrationBarWrapperStyles = {
  position: 'fixed',
  zIndex: '2147483647',
  display: 'block',
  top: 0,
  left: 0,
  width: '330px',
  height: '100vh',
  transform: 'translateX(0)',
  opacity: '1',
  transition: 'transform .3s, opacity .3s'
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
    this.state = {
      hidden: false,
      wrapperStyles: null
    }
  };
  showWrapper = () => {
    this.setState({wrapperStyles: null});
  };
  hideWrapper = () => {
    this.setState({wrapperStyles: {
      transform: 'translateX(-100%)',
      opacity: '0'
    }});
  };
  pickClickSelector = () => {
    return new Promise((resolve, reject) => {
      const clickListener = (e) => {
        const selector = select(e.target);
        document.removeEventListener('click', clickListener);
        document.removeEventListener('keydown', escapeListener);
        resolve(selector);
      };
      const escapeListener = (e) => {
        if (e.keyCode === 27){
          document.removeEventListener('click', clickListener);
          document.removeEventListener('keydown', escapeListener);
          reject();
        }
      };
      document.addEventListener('click', clickListener);
      document.addEventListener('keydown', escapeListener);
    });
  };
  pickInputEntrySelector = () => {
    return new Promise((resolve, reject) => {
      const inputListener = (e) => {
        const selector = select(e.target);
        document.removeEventListener('input', inputListener);
        document.removeEventListener('keydown', escapeListener);
        resolve(selector);
      };
      const escapeListener = (e) => {
        if (e.keyCode === 27){
          document.removeEventListener('input', inputListener);
          document.removeEventListener('keydown', escapeListener);
          reject();
        }
      };
      document.addEventListener('input', inputListener);
      document.addEventListener('keydown', escapeListener);
    });
  };
  runtimeMessageListener = (request, sender, sendResponse) => {
    switch (request.type){
      case 'pick_fill_element_selector':
        this.pickInputEntrySelector().then(response => {
          sendResponse(MessageResponse(false, response));
        }).catch(err => {
          sendResponse(MessageResponse(true, err));
        });
        break;
      case 'pick_click_element_selector':
        this.pickClickSelector().then(response => {
          sendResponse(MessageResponse(false, response));
        }).catch(err => {
          sendResponse(MessageResponse(true, err));
        });
        break;
      case 'websiteIntegrationBar_show':
        this.showWrapper();
        break;
      case 'websiteIntegrationBar_hide':
        this.hideWrapper();
        break;
      default:
        return;
    }
    return true;
  };
  componentWillUnmount(){
    browser.runtime.onMessage.removeListener(this.runtimeMessageListener);
  }
  componentDidMount(){
    browser.runtime.onMessage.addListener(this.runtimeMessageListener);
  }
  render(){
    const wib = this.props.websiteIntegrationBar[this.props.tabId];
    if (!wib)
      return null;
    return (
          <div style={{...websiteIntegrationBarWrapperStyles, ...this.state.wrapperStyles}}>
            <iframe style={websiteIntegrationBarStyles}
                    src={browser.runtime.getURL('pages/background-ui.html#/websiteIntegrationBar')}>
            </iframe>
          </div>
    );
  }
}

export default WebsiteIntegrationBar;
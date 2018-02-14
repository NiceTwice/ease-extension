import React, {Component, Fragment} from "react";
import {connect} from "react-redux";

const savedPopupStyles = {
  position: 'fixed',
  zIndex: '2147483647',
  display: 'block',
  width: '100%',
  height: '100%',
  top: '10px',
  right: '10px',
  maxHeight: '182px',
  maxWidth: '368px'
};

const savedPopupIframeStyles = {
  border: 'none',
  position: 'relative',
  height: '100%',
  width: '100%',
  visibility: 'visible'
};

@connect(store => ({
  savedUpdatePopup: store.savedUpdatePopup
}))
class SavedUpdatePopup extends Component {
  constructor(props){
    super(props);
  }
  render(){
    const savedUpdate = this.props.savedUpdatePopup[this.props.tabId];
    if (!savedUpdate)
      return null;
    return (
        <div style={savedPopupStyles}>
          <iframe style={savedPopupIframeStyles}
                  src={browser.runtime.getURL('pages/background-ui.html#/savedUpdatePopup')}>
          </iframe>
        </div>
    )
  }
}

export default SavedUpdatePopup;
import React, {Fragment, Component} from "react";
import {connect} from "react-redux";

const passwordUpdateAskHelperModalStyles = {
  position: 'fixed',
  zIndex: '2147483647',
  display: 'block',
  width: '350px',
  height: '500px',
  bottom: '10px',
  left: '10px',
  maxHeight: 'calc(100vh - 20px)'
};

const passwordUpdateAskHelperModalIframeStyles = {
  border: 'none',
  position: 'relative',
  height: '100%',
  width: '100%',
  visibility: 'visible'
};

@connect((store, ownProps) => ({
  popup: store.passwordUpdateAskHelperModal[ownProps.tabId]
}))
class PasswordUpdateAskHelperModal extends Component {
  constructor(props){
    super(props);
  }
  render(){
    const {popup} = this.props;

    if (!popup)
      return null;
    return (
      <div style={passwordUpdateAskHelperModalStyles}>
        <iframe style={passwordUpdateAskHelperModalIframeStyles}
        src={browser.runtime.getURL('pages/background-ui.html#/passwordUpdateAskHelperModal')}>
        </iframe>
      </div>
    )
  }
}

export default PasswordUpdateAskHelperModal;
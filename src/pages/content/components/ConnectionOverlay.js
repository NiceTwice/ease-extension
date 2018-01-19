import React, {Component, Fragment} from "react";
import ProgressBar from "./ProgressBar";
import {EaseLogoIcon} from "../../../shared/ImagesBase64";
import {DeleteConnectionOverlay} from "../../../shared/actions/connectionOverlay";
import {connect} from "react-redux";

class ConnectionOverlay extends Component {
  deleteOverlay = () => {
    this.props.dispatch(DeleteConnectionOverlay({
      tabId: this.props.tabId
    }));
  };
  render(){
    const {connectionOverlay, tabId} = this.props;
    const tabConnectionOverlay = !!connectionOverlay ? connectionOverlay[tabId] : null;
//    const tabConnectionOverlay = {};
    if (!tabConnectionOverlay)
      return null;
    return (
        <div id="connection-modal">
          <div class="content-box">
            <i class="fa fa-times close_button" onClick={this.deleteOverlay}/>
            <div class="logo_handler">
              <img src={EaseLogoIcon}/>
            </div>
            <div class="spacer"/>
            <ProgressBar total={tabConnectionOverlay.steps} current={tabConnectionOverlay.currentStep}/>
            <span class="text">Accessing {tabConnectionOverlay.websiteName}</span>
          </div>
        </div>
    )
  }
};

export default connect(store => ({
  connectionOverlay: store.connectionOverlay
}))(ConnectionOverlay);
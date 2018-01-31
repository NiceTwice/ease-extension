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
//    const tabConnectionOverlay = {first_connection: true};
    if (!tabConnectionOverlay)
      return null;
    const {first_connection} = tabConnectionOverlay;
    return (
        <div class="connection_modal">
          <div class="content-box">
            <i class="ease ease-times close_button" onClick={this.deleteOverlay}/>
            <div class="logo_handler">
              <img src={EaseLogoIcon}/>
            </div>
            <div class="spacer"/>
            <ProgressBar total={tabConnectionOverlay.steps} current={tabConnectionOverlay.currentStep}/>
            {!first_connection ?
                <span class="text">Accessing {tabConnectionOverlay.websiteName}</span>:
                <span class="text first_connection">
                  <strong style={{display: 'block'}}>1st connection initializing</strong>
                  <span style={{display: 'block', fontSize: '1.5vh', marginTop: '2vh'}}>Ease.space will log you out then in, to make sure you are on the right account.</span>
                </span>
            }
          </div>
        </div>
    )
  }
};

export default connect(store => ({
  connectionOverlay: store.connectionOverlay
}))(ConnectionOverlay);
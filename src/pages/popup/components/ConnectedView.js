import React, {Component, Fragment} from "react";
import {BackgroundMessage} from "../../../shared/utils";
import StrongPasswordGenerator from "./StrongPasswordGenerator";
import ConnectedHeader from "./ConnectedHeader";
import PopupBody from "./PopupBody";

class ConnectedView extends Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
        <Fragment>
          <ConnectedHeader/>
          <PopupBody/>
          <StrongPasswordGenerator/>
        </Fragment>
    )
  }
}

export default ConnectedView;
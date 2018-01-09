import React, {Component, Fragment} from "react";
import {Button, Loader} from "semantic-ui-react";
import StrongPasswordGenerator from "./StrongPasswordGenerator";
import ConnectedHeader from "./ConnectedHeader";
import PopupBody from "./PopupBody";
import {connect} from "react-redux";
import Runtime from "../../../shared/runtime_api";

class App extends Component {
  constructor(props){
    super(props);
  }
  test = () => {
    Runtime.sendMessage(null, {
      type: 'getUser'
    }, null);
  };
  render(){
    const {loading} = this.props;
    console.log('loading', loading);
    if (!!loading)
      return <Loader/>;
    return (
        <Fragment>
          <Button content={'Click me!'} onClick={this.test}/>
          <ConnectedHeader/>
          <PopupBody/>
          <StrongPasswordGenerator/>
        </Fragment>
    )
  }
}

export default connect(store => ({
  loading: store.loading
}))(App);
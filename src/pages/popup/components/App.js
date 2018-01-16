import React, {Component, Fragment} from "react";
import {Button, Loader} from "semantic-ui-react";
import LoginView from "./LoginView";
import ConnectedView from "./ConnectedView";
import {connect} from "react-redux";
import {BackgroundMessage} from "../../../shared/utils";

class App extends Component {
  constructor(props){
    super(props);
  }
  componentWillMount(){
    BackgroundMessage('getUser');
    BackgroundMessage('getCatalogWebsites');
    BackgroundMessage('setCurrentTab');
  }
  render(){
    const {loading, user} = this.props;
    if (!!loading || user.fetching)
      return (<Loader active size="mini" inline="centered"/>);
    if (!user.information)
      return <LoginView/>;
    return <ConnectedView/>
  }
}

export default connect(store => ({
  loading: store.loading,
  user: store.user
}))(App);
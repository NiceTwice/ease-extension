import React, {Component, Fragment} from "react";
import {List, Button, Container, Loader} from "semantic-ui-react";
import AppList from "./apps/AppList";
import {BackgroundMessage} from "../../../shared/utils";
import {connect} from "react-redux";

@connect(store => ({
  dashboard: store.dashboard
}))
class PopupBody extends Component {
  constructor(props){
    super(props);
  }
  componentWillMount(){
    BackgroundMessage('getProfiles');
  }
  render(){
    const {dashboard} = this.props;

    return (
        <Container id="popup_body">
          {(dashboard.fetching && !dashboard.fetched) ?
          <Loader
              style={{marginTop:'5px', marginBottom:'5px'}}
              size="mini"
              active
              indeterminate
              inline="centered"/> :
          <AppList/>}
        </Container>
    )
  }
}

export default PopupBody;
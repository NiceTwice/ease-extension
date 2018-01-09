import React, {Component, Fragment} from "react";
import Tabs from "../../../shared/tabs_api";
import ContentApi from "../content_api";
import {connect} from "react-redux";
import FormSubmissionListener from "./FormSubmissionListener";
import ConnectionOverlay from "./ConnectionOverlay";

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      tabId: -1
    }
  }
  componentWillMount() {
    ContentApi.getTabId().then(tabId => {
      console.log('tabId: ', tabId);
      this.setState({tabId: tabId});
    });
  }
  render(){
    return (
        <Fragment>
          <ConnectionOverlay tabId={this.state.tabId}/>
          <FormSubmissionListener tabId={this.state.tabId}/>
        </Fragment>
    )
  }
}

export default App;
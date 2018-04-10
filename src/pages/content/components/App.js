import React, {Component, Fragment} from "react";
import Tabs from "../../../shared/tabs_api";
import ContentApi from "../content_api";
import {connect} from "react-redux";
import FormSubmissionListener from "./FormSubmissionListener";
import ConnectionOverlay from "./ConnectionOverlay";
import ScrapGoogleOverlay from "./ScrapGoogleOverlay";
import ConnectionInputsListener from "./ConnectionInputsListener";
import SavedUpdatePopup from "./SavedUpdatePopup";

@connect(store => ({
  loading: store.loading
}))
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      tabId: -1
    }
  }
  componentWillMount() {
    ContentApi.getTabId().then(tabId => {
      this.setState({tabId: tabId});
    });
  }
  render(){
    if (this.props.loading || this.state.tabId === -1)
      return null;
    if (window.top === window)
      return (
          <Fragment>
            <ConnectionOverlay tabId={this.state.tabId}/>
            <ScrapGoogleOverlay tabId={this.state.tabId}/>
            <FormSubmissionListener tabId={this.state.tabId}/>
            <ConnectionInputsListener tabId={this.state.tabId}/>
            <SavedUpdatePopup tabId={this.state.tabId}/>
          </Fragment>
      );
    return (
        <Fragment>
          <FormSubmissionListener tabId={this.state.tabId}/>
          <ConnectionInputsListener tabId={this.state.tabId}/>
        </Fragment>
    )
  }
}

export default App;
import React, {Component, Fragment} from "react";
import {HashRouter, Layout, Route, IndexRoute, HashHistory} from 'react-router-dom';
import SavedUpdatePopup from "./components/SavedUpdatePopup";
import FillInPopup from "./components/fillInPopup";
import PasswordUpdateAskHelperModal from "./components/PasswordUpdateAskHelperModal";
import Tabs from "../../shared/tabs_api";
import {connect} from "react-redux";

@connect(store => ({
  loading: store.loading
}))
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      tabId: -1,
      tab: null
    }
  }
  componentWillMount(){
    Tabs.getCurrent().then(tab => {
      this.setState({tabId: tab.id, tab: tab});
    });
  }
  render(){
    if (!!this.props.loading || this.state.tabId === -1)
      return null;
    return (
        <HashRouter>
          <React.Fragment>
            <Route path="/savedUpdatePopup" render={(props) => <SavedUpdatePopup {...props}{...this.state}/>}/>
            <Route path="/fillInPopup" render={(props) => <FillInPopup {...props}{...this.state}/>}/>
            <Route path="/passwordUpdateAskHelperModal" render={(props) => <PasswordUpdateAskHelperModal {...props}{...this.state}/>}/>
          </React.Fragment>
        </HashRouter>
    )
  }
}

export default App;
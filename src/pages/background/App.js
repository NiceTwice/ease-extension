import React, {Component, Fragment} from "react";
import {HashRouter, Layout, Route, IndexRoute, HashHistory} from 'react-router-dom';
import {Provider} from "react-redux";

class App extends Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
        <HashRouter>
          <React.Fragment>
            <Route path="/savedUpdatePopup" component={SavedUpdate}/>
          </React.Fragment>
        </HashRouter>
    )
  }
}

export default App;
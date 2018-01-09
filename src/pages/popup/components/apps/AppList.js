import React, {Component, Fragment} from "react";
import ClassicApp from "./ClassicApp";
import AnyApp from "./AnyApp";
import {List} from "semantic-ui-react";

class AppList extends Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
        <List>
          <ClassicApp/>
          <AnyApp/>
        </List>
    )
  }
}

export default AppList;
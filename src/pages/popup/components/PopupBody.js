import React, {Component, Fragment} from "react";
import {List, Button, Container} from "semantic-ui-react";
import AppList from "./apps/AppList";

class PopupBody extends Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
        <Container id="popup_body">
          <AppList/>
        </Container>
    )
  }
}

export default PopupBody;
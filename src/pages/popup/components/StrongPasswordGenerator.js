import React, {Component, Fragment} from "react";
import {Icon} from "semantic-ui-react";

class StrongPasswordGenerator extends Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
        <div id="strong_password_generator">
          Generate a strong password <Icon name="magic"/>
        </div>
    )
  }
}

export default StrongPasswordGenerator;
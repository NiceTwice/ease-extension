import React, {Component, Fragment} from "react";
import {List, Button} from "semantic-ui-react";

class ClassicApp extends Component {
  constructor(props){
    super(props);
  }
  render(){
    const login = 'elon@spacex.com';

    return (
      <List.Item class="display_flex align_items_center app classic">
        <span class="full_flex overflow-ellipsis">{login}</span>
        <Button size="mini" content={'Login'} color={'green'}/>
      </List.Item>
    )
  }
}

export default ClassicApp;
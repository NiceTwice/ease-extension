import React, {Component, Fragment} from "react";
import {List, Button, Input, Icon} from "semantic-ui-react";
import {copyTextToClipboard} from "../../../../shared/utils";

class CopyInput extends Component {
  constructor(props){
    super(props);
  }
  render(){
    const val = "elon@spacex.com";

    return (
        <Input size="mini" action actionPosition={'left'} class="copy_input" placeholder="Placeholder" value={val}>
          <Button
              onClick={e => {copyTextToClipboard(val)}}
              color="green"
              icon>
            Copy
            <Icon name="copy"/>
          </Button>
          <input onFocus={e => {copyTextToClipboard(val)}}/>
        </Input>
    )
  }
}

class AnyApp extends Component {
  constructor(props){
    super(props);
  }
  render(){
    const appName = 'Account 1';
    return (
        <List.Item class="display_flex align_items_center app any">
          <span class="full_flex overflow-ellipsis">{appName}</span>
          <List class="copy_inputs_list">
            <List.Item>
              <CopyInput/>
            </List.Item>
            <List.Item>
              <CopyInput/>
            </List.Item>
          </List>
        </List.Item>
    )
  }
}

export default AnyApp;
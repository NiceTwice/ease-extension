import React, {Component, Fragment} from "react";
import {List, Button, Input, Icon} from "semantic-ui-react";
import {copyTextToClipboard, BackgroundMessage} from "../../../../shared/utils";

class CopyInput extends Component {
  constructor(props){
    super(props);
    this.state = {
      copied: false
    }
  }
  copy = () => {
    const {info, app} = this.props;
    BackgroundMessage('track', {
      name: 'PasswordUsed',
      info: {
        id: app.id,
        type: app.type,
        sub_type: app.sub_type,
        from: "CopyCredentialExtensionPopup"
      }
    });
    copyTextToClipboard(info.value);
    this.setState({copied: true});
    setTimeout(() => {
      this.setState({copied: false});
    }, 1000);
  };
  render(){
    const {info} = this.props;

    return (
        <Input size="mini" action actionPosition={'left'} class="copy_input" placeholder="Placeholder" value={info.value}>
          <Button
              onClick={this.copy}
              color="green"
              icon>
            Copy
            <Icon name="copy"/>
          </Button>
          <input
              type={info.name === 'password' ? 'password': 'text'}
              onFocus={this.copy}/>
          {this.state.copied &&
          <div class="copied_helper">Copied!</div>}
        </Input>
    )
  }
}

class AnyApp extends Component {
  constructor(props){
    super(props);
  }
  render(){
    const {app} = this.props;
    const inputs = Object
        .keys(app.account_information)
        .map(item => {
          return {
            name: item,
            value: app.account_information[item]
          }
        });
    return (
        <List.Item class="display_flex align_items_center app any">
          <span class="full_flex overflow-ellipsis">{app.name}</span>
          <List class="copy_inputs_list">
            {inputs.map((item,idx) => {
              return (
                  <List.Item key={idx}>
                    <CopyInput info={item} app={app}/>
                  </List.Item>
              )
            })}
          </List>
        </List.Item>
    )
  }
}

export default AnyApp;
import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import {Icon,Transition, Button, Progress, Header, Form, List} from 'semantic-ui-react';
import {closePasswordUpdateAskHelperModal} from "../../../shared/actions/background-ui";

@connect((store, ownProps) => ({
  popup: store.passwordUpdateAskHelperModal[ownProps.tabId]
}))
class PasswordUpdateAskHelperModal extends Component {
  constructor(props){
    super(props);
  }
  close = () => {
    this.props.dispatch(closePasswordUpdateAskHelperModal({
      tabId: this.props.tabId
    }));
  };
  render(){
    const {popup} = this.props;
    if (!popup)
      return null;
    const {appName, login} = popup;
    return (
        <div class="display_flex flex_direction_column passwordUpdateAskHelperModal">
          <Header as="h5">
            Help to change your password on this site
          </Header>
          <Form>
            <Form.Field style={{fontSize: '14px'}}>
              Account information for {appName}: {login}
            </Form.Field>
            <Form.Field style={{fontSize: '14px'}}>
              <List bulleted as="ul" style={{fontWeight:'bold'}}>
                <List.Item as="li">
                  A strong password generator will appear when you change the password
                </List.Item>
                <List.Item as="li">
                  Your new password will be automatically saved on Ease.space.
                </List.Item>
              </List>
            </Form.Field>
            <Form.Field>
              <img style={{width: '100%'}} src={browser.runtime.getURL('/assets/images/Generate_strong_password.png')}/>
            </Form.Field>
            <Form.Field>
              <Button fluid
                      onClick={this.close}
                      primary
                      content={'Ok, I change it'}/>
            </Form.Field>
          </Form>
        </div>
    )
  }
}

export default PasswordUpdateAskHelperModal;
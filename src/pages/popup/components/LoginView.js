import React, {Component, Fragment} from "react";
import {BackgroundMessage} from "../../../shared/utils";
import {Icon} from "semantic-ui-react";
class LoginView extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: null
    }
  }
  componentWillMount(){
    BackgroundMessage('getCookie', {
      url: 'https://ease.space',
      name: 'fname'
    }).then(cookie => {
      if (!!cookie){
        const val = cookie.value.slice(1, cookie.value.length - 1);
        this.setState({username: atob(val)});
      }
    });
  }
  render(){
    return (
        <Fragment>
          <div id="header">
            <div class="full_flex">
            </div>
            <a target="_blank" href="https://ease.space/" class="display_flex align_items_center" id="dashboard_button">
              <img style={{height: '20px', marginRight: '5px'}} src="/assets/images/ease_full_logo_white.svg"/>
            </a>
          </div>
          <div id="login_view">
            Hello {this.state.username}!<br/>
            Please <a target="_blank" href="https://ease.space/#/login">login</a> <Icon fitted name="smile"/>
          </div>
        </Fragment>
    )
  }
}

export default LoginView;
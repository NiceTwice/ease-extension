import React, {Component, Fragment} from "react";
import {Icon,Transition, Menu, List} from 'semantic-ui-react';
import {NavLink, withRouter, Route, Switch} from "react-router-dom";
import Cookies from "../../../../shared/cookies_api";
import Tabs from "../../../../shared/tabs_api";
import {extractRootDomain, resolveImageURL} from "../../../../shared/utils";
import {connect} from "react-redux";

const isAccountLinkActive = (match, location) => {
  return location.pathname === '/fillInPopup/Accounts' || location.pathname === '/fillInPopup';
};

class LoginView extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: null
    }
  }
  componentWillMount(){
    Cookies.get({
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
        <div class="text-content" style={{textAlign: 'center'}}>
          Hello {this.state.username}!<br/>
          Please <a target="_blank" href="https://ease.space/#/login">login</a> <Icon fitted name="smile"/>
        </div>
    )
  }
}

@connect(store => ({
  dashboard: store.dashboard,
  user: store.user
}))
class Accounts extends Component {
  constructor(props){
    super(props);
    this.state = {
      tab: null
    }
  }
  componentWillMount(){
    Tabs.getCurrent().then(tab => {
      this.setState({tab: tab});
    });
  }
  filterApps = () => {
    const apps = this.props.dashboard.apps;
    const domain = extractRootDomain(this.state.tab.url);
    const filtered = [];

    Object.keys(apps).forEach(app_id => {
      const app = apps[app_id];

      if (!!app.website && !app.empty){
        if (app.website.login_url.indexOf(domain) !== -1 || app.website.landing_url.indexOf(domain) !== -1)
          filtered.push(app);
      }
    });
    return filtered;
  };
  render(){
    const {user} = this.props;
    const {tab} = this.state;

    if (!user.information)
      return <LoginView/>;
    if (!tab)
      return null;
    const apps = this.filterApps();
    if (!apps.length)
      return <div class="text-content">You can fill your connection info on this website in order to save them.</div>;
    return (
        <div>
          <span>Select account</span>
          <List verticalAlign="middle">
            {apps.map(app => {
              return (
                  <List.Item key={app.id} class="display_flex flex_direction_column">
                    <div>
                      <img src={resolveImageURL(app.website.logo)}/>
                    </div>
                    <div>
                      <span>{app.login}</span>
                      <strong>{app.account_information.login}</strong>
                    </div>
                    <div></div>
                  </List.Item>
              )
            })}
          </List>
        </div>
    )
  }
}

class PasswordGenerator extends Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
        <div>Generate strong password</div>
    )
  }
}

@connect(store => ({
  store: store
}))
class FillInPopup extends Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
        <div class="display_flex flex_direction_column fillInPopup">
          <Icon class="close-popup-button"
                name="close"
                link/>
          <Menu tabular id="fillInPopupMenu">
            <Menu.Item as={NavLink} isActive={isAccountLinkActive} to={'/fillInPopup/Accounts'} name="My accounts"/>
            <Menu.Item as={NavLink} to={'/fillInPopup/PasswordGenerator'} name="Generate strong password"/>
          </Menu>
          <div class="fillInPopupContent">
            <Switch>
              <Route exact path="/fillInPopup" component={Accounts}/>
              <Route path="/fillInPopup/Accounts" component={Accounts}/>
              <Route path="/fillInPopup/PasswordGenerator" component={PasswordGenerator}/>
            </Switch>
          </div>
          <div class="arrow"/>
        </div>
    )
  }
}

export default FillInPopup;
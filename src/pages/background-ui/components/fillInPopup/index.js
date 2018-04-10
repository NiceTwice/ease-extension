import React, {Component, Fragment} from "react";
import {Checkbox, Button, Input, Icon,Transition, Menu, List, Dropdown} from 'semantic-ui-react';
import {NavLink, withRouter, Route, Switch} from "react-router-dom";
import Cookies from "../../../../shared/cookies_api";
import Tabs from "../../../../shared/tabs_api";
import {handleSemanticInput,
  extractRootDomain,
  reflect,
  resolveImageURL,
  copyTextToClipboard} from "../../../../shared/utils";
import {BackgroundMessage, extractRootDomainWithoutCountryCode} from "../../../../shared/utils";
import {connect} from "react-redux";
import passwordGenerator from "generate-password";

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

class CopyCredentialsDropdown extends Component {
  constructor(props){
    super(props);
  }
  copy = (value, name) => {
    const {app} = this.props;

    copyTextToClipboard(value);
    if (name === 'password')
      BackgroundMessage('track', {
        name: 'PasswordUsed',
        info: {
          id: app.id,
          type: app.type,
          sub_type: app.sub_type,
          from: "CopyPassword"
        }
      });
  };
  render(){
    const {account_information} = this.props;

    return (
        <Dropdown icon={null} trigger={
          <div class="actions">
            <Icon name="ellipsis vertical" fitted/>
          </div>
        }>
          <Dropdown.Menu class="left">
            {Object.keys(account_information).map(name => {
              const value = account_information[name];
              return (
                  <Dropdown.Item
                      key={name}
                      text={`Copy ${name}`}
                      onClick={this.copy.bind(null, value, name)}/>
              )
            })}
          </Dropdown.Menu>
        </Dropdown>
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
  chooseApp(appId){
    const app = this.props.dashboard.apps[appId];
    BackgroundMessage('track', {
      name: 'PasswordUsed',
      info: {
        id: app.id,
        type: app.type,
        sub_type: app.sub_type,
        from: "FillIn"
      }
    });
    if (!!app){
      Tabs.sendMessage(
          this.state.tab.id,
          {
            type: 'fillAccountInformation',
            data: {
              password: app.account_information.password,
              login: app.account_information.login
            }
          }
      );
    }
  }
  filterApps = () => {
    const apps = this.props.dashboard.apps;
    const domain = extractRootDomainWithoutCountryCode(this.state.tab.url);
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
          <span style={{fontStyle:'italic', paddingLeft: '10px',fontSize:'16px'}}>Select account</span>
          <List verticalAlign="middle" class="app_list">
            {apps.map(app => {
              return (
                  <List.Item key={app.id}
                             onClick={e => {this.chooseApp(app.id)}}
                             class="display_flex align_items_center">
                    <div class="logo_handler">
                      <img class="logo" src={resolveImageURL(app.website.logo)}/>
                    </div>
                    <div class="info">
                      <span class="overflow-ellipsis">{app.name}</span>
                      <strong class="overflow-ellipsis">{app.account_information.login}</strong>
                    </div>
                    <CopyCredentialsDropdown account_information={app.account_information} app={app}/>
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
    this.state = {
      password: '',
      lowercases: true,
      uppercases: true,
      numbers: true,
      specials: false,
      length: 18,
      advanced: false,
      copied: false
    }
  }
  copy = () => {
    copyTextToClipboard(this.state.password);
    this.setState({copied: true});
    setTimeout(() => {
      this.setState({copied: false})
    }, 2000);
  };
  refresh = () => {
    this.setState({
      password: passwordGenerator.generate({
        length: this.state.length,
        numbers:this.state.numbers,
        symbols: this.state.specials,
        uppercase: this.state.uppercases,
        strict: true
      })});
  };
  toggleAdvanceOptions = () => {
    this.setState({
      lowercases: true,
      uppercases: true,
      numbers: true,
      specials: false,
      length: 18,
      advanced: !this.state.advanced
    });
  };
  componentWillMount(){
    this.refresh();
  }
  sendGeneratedPassword = () => {
    Tabs.getCurrent().then(tab => {
      Tabs.sendMessage(tab.id, {
        type: 'fillGeneratedPassword',
        data: {
          password: this.state.password
        }
      });
    });
  };
  handleInput = handleSemanticInput.bind(this);
  render(){
    return (
        <div id="passwordGenerator">
          <Input value={this.state.password}
                 id="passwordInput"
                 readOnly
                 fluid
                 action={<Button content="Fill" onClick={this.sendGeneratedPassword}/>}
                 placeholder="Your password"/>
          <div class="display_flex controls">
              <span onClick={this.toggleAdvanceOptions} class="full_flex display_flex align_items_center">
                <a>Password options</a>
                {this.state.advanced ?
                    <Icon name="chevron down"/> :
                    <Icon name="chevron right"/>}
              </span>
            <Icon name="refresh" link onClick={this.refresh}/>
            {this.state.copied ?
                <Icon name="check" color="green"/> :
                <Icon name="copy" link onClick={this.copy}/>}
          </div>
          {this.state.advanced &&
          <div class="advancedOptions">
            <div class="display_flex">
              <span class="full_flex">Number of characters:</span>
              <span>{this.state.length}</span>
            </div>
            <input class="lengthInput"
                   name="length"
                   min="6"
                   max="100"
                   type="range"
                   onChange={(e) => {this.setState({length: e.target.value})}}
                   value={this.state.length}/>
            <div class="display_flex flex_direction_column">
              <div class="display_flex checkboxSet">
                <Checkbox label="Lowercases"
                          checked={this.state.lowercases}/>
                <Checkbox label="Numbers"
                          name="numbers"
                          checked={this.state.numbers}
                          onChange={this.handleInput}/>
              </div>
              <div class="display_flex checkboxSet">
                <Checkbox label="Uppercases"
                          name="uppercases"
                          checked={this.state.uppercases}
                          onChange={this.handleInput}/>
                <Checkbox label="!@&%#?)<$"
                          name="specials"
                          checked={this.state.specials}
                          onChange={this.handleInput}/>
              </div>
            </div>
          </div>}
        </div>
    )
  }
}

@connect()
class FillInPopup extends Component {
  constructor(props){
    super(props);
  }
  close = () => {
    Tabs.getCurrent().then(tab => {
      Tabs.sendMessage(tab.id, {
        type: 'closeFillInMenu'
      });
    });
  };
  componentWillMount(){
    reflect(BackgroundMessage('getProfiles'));
  }
  render(){
    return (
        <div class="display_flex flex_direction_column fillInPopup">
          <Icon class="close-popup-button"
                name="close"
                onClick={this.close}
                link/>
          <Menu tabular id="fillInPopupMenu">
            <Menu.Item as={NavLink}
                       isActive={isAccountLinkActive}
                       to={'/fillInPopup/Accounts'}
                       name="My accounts"/>
            <Menu.Item as={NavLink}
                       to={'/fillInPopup/PasswordGenerator'}
                       name="Generate strong password"/>
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
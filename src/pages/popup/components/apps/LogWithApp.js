import React, {Component, Fragment} from "react";
import {BackgroundMessage} from "../../../../shared/utils";
import {List, Button, Icon, Label} from "semantic-ui-react";
import {connect} from "react-redux";

const websiteColors = {
  facebook: '#3b5998',
  linkedin: '#1f88be'
};

@connect(store => ({
  tab: store.common.currentTab,
  apps: store.dashboard.apps
}))
class LogwithApp extends Component {
  constructor(props){
    super(props);
    this.state = {
      connecting: false
    }
  }
  connect = () => {
    const {tab, app} = this.props;

    this.setState({connecting: true});
    BackgroundMessage('track', {
      name: 'PasswordUsed',
      info: {
        id: app.id,
        type: app.type,
        sub_type: app.sub_type,
        from: 'Extension'
      }
    });
    BackgroundMessage('app_connection', {
      app_id: app.id,
      tab: tab,
      website: app.website
    }).then(response => {
      this.setState({connecting: false});
    });
  };
  render(){
    const {app, apps} = this.props;
    const logwithApp = apps[app.logWithApp_id];
    const logwithName = logwithApp.website.name.toLowerCase();

    return (
        <List.Item class="display_flex align_items_center app logwith">
          <span class="full_flex overflow-ellipsis display_flex">
            <div class="logwith_label" style={{backgroundColor: websiteColors[logwithName]}}>
              <Icon name={logwithName}/>
              {logwithApp.account_information.login}
            </div>
          </span>
          <Button
              onClick={this.connect}
              loading={this.state.connecting}
              size="mini"
              content={'Login'}
              color={'green'}/>
        </List.Item>
    )
  }
}

export default LogwithApp;
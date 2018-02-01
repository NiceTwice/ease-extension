import React, {Component, Fragment} from "react";
import {List, Button} from "semantic-ui-react";
import {BackgroundMessage} from "../../../../shared/utils";
import {connect} from "react-redux";

@connect(store => ({
  tab: store.common.currentTab
}))
class ClassicApp extends Component {
  constructor(props){
    super(props);
    this.state = {
      connecting: false
    }
  }

  connect = () => {
    const {app, tab} = this.props;
    this.setState({connecting: true});
    BackgroundMessage('app_connection', {
      app_id: app.id,
      tab: tab,
      website: app.website
    }).then(response => {
      this.setState({connecting: false});
    });
  };
  render(){
    const {app} = this.props;

    return (
      <List.Item class="display_flex align_items_center app classic">
        <span class="full_flex overflow-ellipsis">{app.account_information.login} {(!!app.website.sso_id || app.website.name.indexOf('Google') !== -1) ? `(${app.name})` : null}</span>
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

export default ClassicApp;
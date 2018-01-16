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
    BackgroundMessage('connect_tab', {
      app_id: app.id,
      account_information: app.account_information,
      tab: tab
    }).then(response => {
      this.setState({connecting: false});
    });
  };
  render(){
    const {app} = this.props;

    return (
      <List.Item class="display_flex align_items_center app classic">
        <span class="full_flex overflow-ellipsis">{app.account_information.login}</span>
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
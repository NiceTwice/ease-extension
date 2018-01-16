import React, {Component, Fragment} from "react";
import {getUrl} from "../../../shared/utils";
import {connect} from "react-redux";

@connect(store => ({
  tab: store.common.currentTab,
  websites: store.catalog.websites
}))
class ConnectedHeader extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: ''
    }
  }
  componentWillMount(){
    const {tab, websites} = this.props;
    const hostname = getUrl(tab.url).hostname;

    const website = websites.find(item => {
      return item.landing_url.indexOf(hostname) !== -1
    });
    if (!!website)
      this.setState({name: website.name});
  }
  render(){
    const {tab} = this.props;
    const hostname = getUrl(tab.url).hostname;

    return (
        <div id="header">
          <div style={{overflow: 'hidden'}} class="full_flex display_flex align_items_center">
            <img style={{height: '20px', marginRight: '5px'}} src={tab.favIconUrl}/>
            <span class="overflow-ellipsis">{!!this.state.name.length ? this.state.name : hostname}</span>
          </div>
          <a target="_blank" href="https://ease.space/#/main/dashboard" class="display_flex align_items_center" id="dashboard_button">
            <img style={{height: '20px', marginRight: '5px'}} src="/assets/images/ease_logo_white.svg"/>
            Go to dashboard
          </a>
        </div>
    )
  }
}

export default ConnectedHeader;
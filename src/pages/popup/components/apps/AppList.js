import React, {Component, Fragment} from "react";
import {List, Icon} from "semantic-ui-react";
import {connect} from "react-redux";
import {getUrl, extractRootDomain} from "../../../../shared/utils";
import AppWrapper from "./AppWrapper";

const matchUrls = (website, hostname) => {
  return website.landing_url.indexOf(hostname) !== -1 || website.login_url.indexOf(hostname) !== -1;
};

function filter_apps(apps, url) {
  let hostname = getUrl(url).hostname;
  if (hostname.indexOf('google') === -1)
    hostname = extractRootDomain(url);

  return Object.keys(apps)
      .map(item => (apps[item]))
      .filter(item => {
        switch (item.type) {
          case ('classicApp'):
            return matchUrls(item.website, hostname);
          case ('ssoApp'):
            return matchUrls(item.website, hostname);
          case ('teamSingleApp'):
            if (item.sub_type === 'classic' || item.sub_type === 'any')
              return matchUrls(item.website, hostname);
            break;
          case ('teamEnterpriseApp'):
            if (item.sub_type === 'classic' || item.sub_type === 'any')
              return matchUrls(item.website, hostname);
            break;
          case ('anyApp'):
            return matchUrls(item.website, hostname);
            break;
          case ('logWithApp'):
            return matchUrls(item.website, hostname);
            break;
          default:
            return false;
        }
        return false;
      });
}

@connect(store => ({
  apps: store.dashboard.apps,
  tab: store.common.currentTab
}))
class AppList extends Component {
  constructor(props){
    super(props);
  }
  render(){
    const {tab, apps} = this.props;
    const filtered = filter_apps(apps, tab.url);

    if (!filtered.length)
      return (
          <div class="content_div" style={{borderBottom: '1px solid #e8ecf1'}}>
            <a target="_blank" href="https://ease.space/#/main/catalog/website">Add to my dashboard <Icon name="book"/></a>
          </div>
      );
    return (
        <List>
          {filtered.map(app => {
            return <AppWrapper app={app} key={app.id}/>
          })}
        </List>
    )
  }
}

export default AppList;
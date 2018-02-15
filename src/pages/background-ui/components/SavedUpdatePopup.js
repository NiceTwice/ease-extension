import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import {Icon,Transition} from 'semantic-ui-react';
import {closeSavedUpdatePopup} from "../../../shared/actions/background-ui";

@connect(store => ({
  savedUpdatePopup: store.savedUpdatePopup
}))
class SavedUpdate extends Component {
  constructor(props){
    super(props);
  }
  close = () => {
    this.props.dispatch(closeSavedUpdatePopup({
      tabId: this.props.tab.id
    }))
  };
  render(){
    const savedUpdate = this.props.savedUpdatePopup[this.props.tab.id];
    if (!savedUpdate)
      return null;
    return (
        <Transition
            visible={true}
            animation='drop'
            duration={300}
            transitionOnMount={true}>
          <div class="display_flex savedUpdate">
            <Icon onClick={this.close}
                  class="close-popup-button"
                  name="close"
                  link/>
            <div class="img_holder">
              <img src={savedUpdate.logo_url}/>
            </div>
            <div class="savedUpdateContent display_flex flex_direction_column">
              <h5>Update detected</h5>
              <span class="overflow-ellipsis">{savedUpdate.origin}</span>
              <span class="overflow-ellipsis">{savedUpdate.account_information.login}</span>
              <span>●●●●●●●●</span>
              <span class="link" style={{textAlign: 'right', color: '#414141'}}><a target="_blank" href="https://ease.space/#/main/catalog/website">Manage now</a><Icon name="caret right"/></span>
            </div>
          </div>
        </Transition>
    )
  }
}

export default SavedUpdate;
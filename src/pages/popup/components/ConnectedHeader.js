import React, {Component, Fragment} from "react";

class ConnectedHeader extends Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
        <div id="connected_header">
          <div class="full_flex">

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
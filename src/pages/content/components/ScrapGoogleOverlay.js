import React, {Component, Fragment} from "react";
import {connect} from "react-redux";

class ScrapGoogleOverlay extends Component {
  constructor(props){
    super(props);
  }
  render(){
    const {tabId, scrapGoogleOverlay} = this.props;
    const scrapOverlay = !!scrapGoogleOverlay && !!scrapGoogleOverlay[tabId];

    if (!scrapOverlay)
      return null;
    return (
        <div class="connection_modal" id="chrome_scrapping_overlay">
          <div class="content-box">
            <div style={{width: '100%'}} class="display_flex align_items_center">
              <img style={{height: '5vh', marginRight: '1.5vh'}} src={browser.runtime.getURL('/assets/images/scraping/chrome.png')}/>
              <strong style={{fontSize:'2.9vh'}}>
                Google Chrome<br/>is being imported
              </strong>
            </div>
            <strong
                class="text-center"
                style={{fontSize:'2.3vh', marginTop: '5vh'}}>Stay on this tab until it closes!<br/>(about 45sec)</strong>
            <div style={{margin:'5vh 0 5vh 0'}}>
              <div class="loader"/>
            </div>
            <span
                class="text-center"
                style={{fontSize: '2.1vh'}}>You'll select the accounts you want to keep right after this step</span>
          </div>
        </div>
    )
  }
}

export default connect(store => ({
  scrapGoogleOverlay: store.scrapGoogleOverlay
}))(ScrapGoogleOverlay);
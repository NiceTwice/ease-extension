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
        <div id="ease_overlay_scrap" class="overlayScrap">
          <div class="containerScrap">
            <img src="chrome-extension://hnacegpfmpknpdjmhdmpkmedplfcmdmp/assets/images/scraping/logo.png" class="logoEase"/>
            <div class="titleContainer">
              <p class="title">Importing accounts saved in</p>
            </div>
            <div class="websiteContainer">
              <img src="chrome-extension://hnacegpfmpknpdjmhdmpkmedplfcmdmp/assets/images/scraping/chrome.png"/>
              <span>Google Chrome</span>
            </div>
            <div class="loader"/>
            <div class="infoContainer">
              <p>You’ll select the ones you want to</p>
              <p>keep right after this.</p>
            </div>
          </div>
        </div>
    )
  }
}

export default connect(store => ({
  scrapGoogleOverlay: store.scrapGoogleOverlay
}))(ScrapGoogleOverlay);
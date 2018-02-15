import React, {Component, Fragment} from "react";

const fillInPopupStyles = {
  position: 'fixed',
  zIndex: '2147483647',
  display: 'block',
  width: '390px',
  height: '250px',
  top: '10px',
  left: '10px'
};

const fillInPopupIframeStyles = {
  border: 'none',
  position: 'relative',
  height: '100%',
  width: '100%',
  visibility: 'visible'
};

class FillInMenu extends Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
        <div style={fillInPopupStyles}>
          <iframe src={browser.runtime.getURL('pages/background-ui.html#/fillInPopup')}
                  style={fillInPopupIframeStyles}/>
        </div>
    )
  }
}

export default FillInMenu;
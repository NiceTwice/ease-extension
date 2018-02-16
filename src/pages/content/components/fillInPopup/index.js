import React, {Component, Fragment} from "react";

const fillInPopupStyles = {
  position: 'fixed',
  zIndex: '2147483647',
  display: 'block',
  width: '390px',
  height: '285px'
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
    this.state = {
      ready: false,
      top: 0,
      left: 0
    };
    this.target = null;
  }
  placeIt = () => {
    let input = $(this.target);
    let inputHeight = input.outerHeight();
    let inputWidth = input.outerWidth();
    let inputOffset = input.offset();
    let position = input[0].getBoundingClientRect();
    let documentScrollTop = $(document).scrollTop();
    console.log('input height', inputHeight);
    console.log('input offset', inputOffset);
    this.setState({
      ready: true,
      top: position.top + inputHeight,
      left: position.left + 8 - (390 - inputWidth)
    });
  };
  hide = () => {
    this.setState({ready: false});
  };
  listener = (e) => {
    if ($(e.target).closest('#ease-frame').length === 0) {
      console.log('hiding frame');
      $(document).off('click', this.listener);
      this.hide();
      document.removeEventListener('scroll', this.onScroll, true);
      window.removeEventListener('resize', this.onResize);
    }
  };
  onResize = (e) => {
    this.placeIt();
  };
  onScroll = (e) => {
    this.placeIt();
  };
  componentDidMount(){
    $('input').click((e) => {
      this.target = e.target;
      this.placeIt();
      document.addEventListener('scroll', this.onScroll, true);
      window.addEventListener('resize', this.onResize);
      setTimeout(() => {
        $(document).on('click', this.listener);
      }, 300);
    });
  }
  render(){
    if (!this.state.ready)
      return null;
    return (
        <div id="ease-frame"
             style={{
               ...fillInPopupStyles,
               top: this.state.top,
               left: this.state.left
             }} ref={(ref) => {this.frame = ref;}}>
          <iframe src={browser.runtime.getURL('pages/background-ui.html#/fillInPopup')}
                  style={fillInPopupIframeStyles}/>
        </div>
    )
  }
}

export default FillInMenu;
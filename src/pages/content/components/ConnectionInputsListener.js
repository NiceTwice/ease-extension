import React, {Fragment, Component} from "react";
import {EaseInputLogoIconActive, EaseInputLogoIcon} from "../../../shared/ImagesBase64";
import Storage from "../../../shared/storage_api";

let lastId = -1;

const connectionActiveInputStyles = {
  backgroundImage: EaseInputLogoIconActive,
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'scroll',
  backgroundSize: '18x 18px',
  backgroundPosition: '98% 50%',
  cursor: 'auto'
};

const connectionInputStyles = {
  backgroundImage: EaseInputLogoIcon,
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'scroll',
  backgroundSize: '18px 18px',
  backgroundPosition: '98% 50%',
  cursor: 'auto'
};

function getAllFormsWithPasswords(){
  let inputPasswords = $('input[type=password]');
  let forms = [];


  inputPasswords.each(function(index) {
    let obj = {
      formEl: null,
      passwordEl: null,
      loginEl: null
    };
    let input = $(this)[0];
    let form = input.closest('form');

    if (!!form.length)
      obj.formEl = form[0];
  });
}

class ConnectionInputsListener extends Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
    let input = document.querySelector('.email-input');

    let forms = document.querySelectorAll('form');

    console.log('connection input listener did mount');
    let inputs = document.querySelectorAll('input');
    const visibleInputs = $(inputs).filter(':visible');
    visibleInputs.each(function(idx){
      let input = $(this);
      console.log('applying styles', input);
      input.css(connectionInputStyles);
      input.hover(function(){
        $(this).css({
          backgroundImage: EaseInputLogoIconActive
        });
      }, function(){
        $(this).css({
          backgroundImage: EaseInputLogoIcon
        });
      });
    });
  }
  render(){
    return null;
  }
}

export default ConnectionInputsListener;
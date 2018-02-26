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

const getVisibleInputs = (form) => {
  const inputs = form.getElementsByTagName('input');
  let ret = [];

  for (let i = 0; i < inputs.length; i++){
    const input = inputs[i];
    if ($(input).is(':visible') && input.type !== 'checkbox')
      ret.push(input);
  }
  return ret;
};

const getPasswordInputIndex = (inputs) => {
  for (let i = 0;i < inputs.length; i++){
    if (inputs[i].type === 'password')
      return i;
  }
  return -1;
};


function checkDocumentForms(){
  let forms = [];
  let docForms = document.querySelectorAll('form');

  for (let form of docForms){
    let inputs = getVisibleInputs(form);
    let loginEl = null;
    let passwordEl = null;
    let passwordIndex = getPasswordInputIndex(inputs);
    if (passwordIndex >= 0)
      passwordEl = inputs[passwordIndex];
    if (passwordIndex > 0){
      loginEl = inputs[passwordIndex - 1];
    }
    forms.push({
      formEl: form,
      loginEl: loginEl,
      passwordEl: passwordEl
    });
  }
  return forms;
}

class ConnectionInputsListener extends Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
    let forms = checkDocumentForms();

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
import React, {Fragment, Component} from "react";
import "../../../shared/browser";
import {EaseInputLogoIconActive, EaseInputLogoIcon} from "../../../shared/ImagesBase64";
import Storage from "../../../shared/storage_api";
import FillInPopup from "./fillInPopup";

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

function checkForm(form){
  let inputs = getVisibleInputs(form);
  let loginEl = null;
  let passwordEl = null;
  let passwordIndex = getPasswordInputIndex(inputs);
  if (passwordIndex >= 0)
    passwordEl = inputs[passwordIndex];
  if (passwordIndex > 0){
    loginEl = inputs[passwordIndex - 1];
  }
  return {
    formEl: form,
    loginEl: loginEl,
    passwordEl: passwordEl
  }
}

function checkDocumentFormsWithPasswords(){
  let forms = [];
  let docForms = document.querySelectorAll('form');

  for (let form of docForms){
    forms.push(checkForm(form));
  }
  forms = forms.filter((form) => (!!form.passwordEl));
  return forms;
}

function setupInput(input) {
  let jInput = $(input);

  jInput.css(connectionInputStyles);
  jInput.hover(function(){
    $(this).css({
      backgroundImage: EaseInputLogoIconActive
    });
  }, function(){
    $(this).css({
      backgroundImage: EaseInputLogoIcon
    });
  });
}

class ConnectionInputsListener extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentInput: null
    };
    this.forms = null;
  }
  openListener = (e) => {
    if (this.state.currentInput !== e.target){
      if (!this.state.currentInput)
        browser.runtime.onMessage.addListener(this.runtimeMessageListener);
      this.setState({
        currentInput: e.target
      });
    }
  };
  closeFillInMenu = () => {
    this.setState({currentInput: null});
    browser.runtime.onMessage.removeListener(this.runtimeMessageListener);
  };
  runtimeMessageListener = (request, sender, sendResponse) => {
    switch (request.type){
      case 'fillAccountInformation':
        this.fillFields(request.data);
        break;
      case 'closeFillInMenu':
        this.closeFillInMenu();
        break;
      default:
        return;

    }
  };
  fillFields = (account_information) => {
    if (!!this.state.currentInput){
      const form = $(this.state.currentInput).closest('form');
      if (!!form.length){
        const formObj = checkForm(form[0]);
        if (!!formObj.loginEl && !!account_information.login)
          $(formObj.loginEl).val(account_information.login);
        if (!!formObj.passwordEl && !!account_information.password)
          $(formObj.passwordEl).val(account_information.password);
      }
      this.closeFillInMenu();
    }
  };
  componentDidMount(){
    let forms = checkDocumentFormsWithPasswords();

    forms.map((form) => {
      if (!!form.loginEl)
        setupInput(form.loginEl);
      setupInput(form.passwordEl);
    });
    this.forms = forms;
    this.forms.map((item, idx) => {
      if (!!item.loginEl)
        item.loginEl.addEventListener('click', this.openListener);
      item.passwordEl.addEventListener('click', this.openListener);
    });
    console.log('connection input listener did mount');
  }
  render(){
    if (!this.state.currentInput)
      return null;
    return <FillInPopup target={this.state.currentInput}/>;
  }
}

export default ConnectionInputsListener;
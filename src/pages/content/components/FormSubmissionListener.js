import React, {Component, Fragment} from "react";
import $ from "jquery";
import Runtime from "../../../shared/runtime_api";

const getVisibleInputs = ({form}) => {
  const inputs = form.getElementsByTagName('input');
  let ret = [];

  for (let i = 0; i < inputs.length; i++){
    const input = inputs[i];
    if ($(input).is(':visible') && input.type !== 'checkbox')
      ret.push(input);
  }
  return ret;
};

const getInputs = ({form}) => {
  const inputs = form.getElementsByTagName('input');
  let ret = [];

  for (let i = 0; i < inputs.length; i++){
    const input = inputs[i];
    if (input.type !== 'checkbox')
      ret.push(input);
  }
  return ret;
};

const getLastPasswordInput = (inputs) => {
  for (let i = 0; i < inputs.length; i++){
    if (inputs[i].type === 'password' && $(inputs[i]).is(':visible'))
      return i;
  }
  return -1;
};

const getEmailInputFromPasswordIndex = (inputs, passwordInputIndex) => {
  let loginInput = null;
  for (let i = passwordInputIndex - 1; i >= 0; i--){
    const input = inputs[i];
    if (input.type === 'email') {
      loginInput = input;
      break;
    }
  }
  return loginInput;
};

const getLoginInputFromPasswordIndex = (inputs, passwordInputIndex) => {
  let loginInput = null;
  for (let i = passwordInputIndex - 1; i >= 0; i--){
    const input = inputs[i];
    if ($(input).is(':visible') && input.type !== 'checkbox') {
      loginInput = input;
      break;
    }
  }
  if (!loginInput)
    loginInput = getEmailInputFromPasswordIndex(inputs, passwordInputIndex);
  return loginInput;
};

const checkForm = (form) => {
  let account = {};
  let inputs = getInputs({
    form: form
  });
  let passwordInput = null;
  let loginInput = null;
  let passwordInputIndex = getLastPasswordInput(inputs);
  if (passwordInputIndex < 1)
    return;
  passwordInput = inputs[passwordInputIndex];
  loginInput = getLoginInputFromPasswordIndex(inputs, passwordInputIndex);
  if (!loginInput)
    return;
  account.password = passwordInput.value;
  account.login = loginInput.value;
  if (!account.password || !account.login)
    return;
  Runtime.sendMessage(null,
      {
        type: 'formSubmission',
        data: {
          account: account,
          origin: document.location.origin,
          hostname: document.location.hostname,
          url: document.location.href
        }
      }, null);
};

class FormSubmissionListener extends Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
    console.log('mounted');
    $(document).on('click', '#passwordNext', (e) => {
      let button = e.target;
      let form = $(button).closest('form');
      if (!!form.length)
        checkForm(form[0]);
    });
    $(document).on('submit', 'form', (e) => {
      checkForm(e.target);
    });
  }
  render(){
    return null
  }
}

export default FormSubmissionListener;
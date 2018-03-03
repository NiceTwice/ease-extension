import React, {Component, Fragment} from "react";
import Runtime from "../../../shared/runtime_api";

const submitButtonNames = ['log in', 'sign in','signin', 'login', 'go', 'submit', 'continue', 'next'];

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
  let passwordInputIndex = getLastPasswordInput(inputs);
  if (passwordInputIndex < 1)
    return;
  let passwordInput = inputs[passwordInputIndex];
  let loginInput = getLoginInputFromPasswordIndex(inputs, passwordInputIndex);
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

let lastSubmit = -1;

class FormSubmissionListener extends Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
    document.addEventListener('submit', (e) => {
      if (new Date().getTime() - lastSubmit < 200)
        return;
      lastSubmit = new Date().getTime();
      checkForm(e.target);
    });
    document.addEventListener('keydown', (e) => {
      if (e.keyCode !== 13 || (new Date().getTime() - lastSubmit) < 200) {
        return;
      }
      const target = $(e.target);
      if (!target.is('input[type=password]')) {
        return;
      }
      const form = target.closest('form');
      if (!!form.length) {
        lastSubmit = new Date().getTime();
        checkForm(form[0]);
      }
    });
    $(document).on('click', '#passwordNext', (e) => {
      let form = $('.IBs8e.PIboA');
      if (new Date().getTime() - lastSubmit < 200)
        return;
      if (!!form.length) {
        lastSubmit = new Date().getTime();
        checkForm(form[0]);
      }
    });
    document.addEventListener('click', (e) => {
      const jButton = $(e.target);
      if (new Date().getTime() - lastSubmit < 200)
        return;
      if (jButton.attr('type') === 'submit'){
        let form = jButton.closest('form');
        if (!!form.length) {
          lastSubmit = new Date().getTime();
          checkForm(form[0]);
        }
        return;
      }
      if (jButton.is('a, span, button[type="button"], input[type="button"]')){
        let button = e.target;
        let buttonText = '';
        if (button.tagName.toLowerCase() === 'input')
          buttonText = button.value;
        else
          buttonText = button.innerText;
        buttonText = buttonText.trim().toLowerCase();
        if (submitButtonNames.indexOf(buttonText) !== -1){
          let form = jButton.closest('form');
          if (!!form.length) {
            lastSubmit = new Date().getTime();
            checkForm(form[0]);
          }
        }
      }
    });
  }
  render(){
    return null
  }
}

export default FormSubmissionListener;
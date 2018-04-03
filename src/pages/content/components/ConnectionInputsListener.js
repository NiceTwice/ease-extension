import React, {Fragment, Component} from "react";
import "../../../shared/browser";
import {EaseInputLogoIconActive, EaseInputLogoIcon} from "../../../shared/ImagesBase64";
import Storage from "../../../shared/storage_api";
import FillInPopup from "./fillInPopup";

function sendKey(input, key) {
  var e = input.ownerDocument.createEvent("KeyboardEvent");
  // FIREFOX : e.initKeyEvent("keydown", 1, 1, null, 0, 0, 0, 0, key, 0)
  e.initKeyboardEvent("keydown", 1, 1, document.defaultView, 0, 0, 0, 0, key, key);
  var f = input.dispatchEvent(e);
  //FIREFOX f && (e = input.ownerDocument.createEvent("KeyboardEvent"), e.initKeyEvent("keypress", 1, 1, null, 0, 0, 0, 0, key, 0), f = input.dispatchEvent(e));
  e = input.ownerDocument.createEvent("KeyboardEvent");
  //FIREFOX e.initKeyEvent("keyup", 1, 1, null, 0, 0, 0, 0, key, 0)
  e.initKeyboardEvent("keyup", 1, 1, null, 0, 0, 0, 0, key, key);
  input.dispatchEvent(e);
}

function fire_before_fill(a) {
  sendKey(a, 16); //shift
  sendKey(a, 32); //space
  sendKey(a, 8); //backspace
}

function fire_onchange(a) {
  var d = a.ownerDocument.createEvent("Events");
  d.initEvent("change", !0, !0);
  a.dispatchEvent(d);
  d = a.ownerDocument.createEvent("Events");
  d.initEvent("input", !0, !0);
  a.dispatchEvent(d);
}

function fillField(field, value){
  field.focus();
  fire_before_fill(field);
  field.value = value;
  $(field).val(value);
  fire_onchange(field);
  field.blur();
}

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

const ConnectionInputIcon = (props) => {
  return (
      <div class="ease-fillin-input-icon" {...props}/>
  )
};

const getInputs = (form) => {
  const inputs = form.getElementsByTagName('input');
  let ret = [];

  for (let i = 0; i < inputs.length; i++){
    const input = inputs[i];
    if (input.type !== 'checkbox')
      ret.push(input);
  }
  return ret;
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

function fillPasswordForms(account_information){
  const docForms = document.querySelectorAll('form');
  let forms = [];

  for (let form of docForms){
    if (form.querySelector('input[type=password')){
      const descForm = checkForm(form);
      if (!!descForm.passwordEl)
        forms.push(descForm);
    }
  }
  if (!!forms.length){
    forms.forEach((form) => {
      if (!!form.loginEl)
        fillField(form.loginEl, account_information.login);
      fillField(form.passwordEl, account_information.password);
    });
  }
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'fillThisPage'){
    fillPasswordForms(request.data.account_information);
  }
});

const getFirstPasswordInputIndex = (inputs) => {
  for (let i = 0; i < inputs.length; i++){
    if (inputs[i].type === 'password')
      return i;
  }
  return -1;
};

const describeForm = (form) => {
  let inputs = getVisibleInputs(form);
  let formInputs = [];
  let passwordInputIndex = getPasswordInputIndex(inputs);

  if (passwordInputIndex > 0)
    formInputs.push(inputs[passwordInputIndex - 1]);
  for (let i = passwordInputIndex; i < inputs.length; i++){
    const input = inputs[i];
    if (input.type === 'password')
      formInputs.push(input);
  };
};

class ConnectionInputsListener extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentInput: null,
      inputs: []
    };
    this.domObservationCollectTimeout = null;
    this.formObservationInterval = -1;
    this.forms = [];
  }
  openListener = (input) => {
    if (this.state.currentInput !== input){
      if (!this.state.currentInput)
        browser.runtime.onMessage.addListener(this.runtimeMessageListener);
      this.setState({
        currentInput: input
      }, this.setCloseListeners);
    }
  };
  setCloseListeners = () => {
    document.addEventListener('click', this.documentClickListener);
  };
  removeCloseListeners = () => {
    document.removeEventListener('click', this.documentClickListener);
  };
  documentClickListener = (e) => {
    const target = $(e.target);
    if (target.closest('#ease-frame, .ease-fillin-input-icon').length === 0 && !target.is(this.state.currentInput)){
      this.closeFillInMenu();
    }
  };
  closeFillInMenu = () => {
    this.removeCloseListeners();
    this.setState({currentInput: null});
    browser.runtime.onMessage.removeListener(this.runtimeMessageListener);
  };
  runtimeMessageListener = (request, sender, sendResponse) => {
    switch (request.type){
      case 'fillAccountInformation':
        this.fillFields(request.data);
        break;
      case 'fillGeneratedPassword':
        this.fillGeneratedPassword(request.data);
        break;
      case 'closeFillInMenu':
        this.closeFillInMenu();
        break;
      default:
        return;
    }
    return false;
  };
  fillGeneratedPassword = ({password}) => {
    if (!!this.state.currentInput){
      const form = $(this.state.currentInput).closest('form');
      if (!!form.length) {
        const inputs = getVisibleInputs(form[0]);
        const newPasswordInput = inputs.find(item => {
          return item.type === 'password' && (item.autocomplete === 'new-password' || item.autocomplete === 'off');
        });
        if (!!newPasswordInput){
          inputs.forEach(input => {
            if (input.type === 'password' && (input.autocomplete === 'new-password' || input.autocomplete === 'off'))
              fillField(input, password);
          });
        }else {
          inputs.forEach(input => {
            if (input.type === 'password')
              fillField(input, password)
          });
        }
      }
      this.closeFillInMenu();
    }
  };
  fillFields = (account_information) => {
    if (!!this.state.currentInput){
      const form = $(this.state.currentInput).closest('form');
      if (!!form.length){
        const formObj = checkForm(form[0]);
        if (!!formObj.loginEl && !!account_information.login)
          fillField(formObj.loginEl, account_information.login);
        if (!!formObj.passwordEl && !!account_information.password)
          fillField(formObj.passwordEl, account_information.password);
      }
      this.closeFillInMenu();
    }
  };
  getInputIconPosition = (inpt) => {
    const input = $(inpt);
    const width = input.outerWidth();
    const height = input.outerHeight();
    const position = inpt.getBoundingClientRect();
    const heightOffset = (height - 16) / 2;

    return {
      top: position.top + ((height - 16) / 2),
      left: position.left + width - 16 - heightOffset
    }
  };
  setupConnectionInput = (input) => {
    let inputs = this.state.inputs;
    inputs.push({
      input: input,
      iconPosition: this.getInputIconPosition(input)
    });
    this.setState({inputs: inputs});
  };
  describeForms = (form) => {
    let inputs = getVisibleInputs(form.formEl);
    let formInputs = [];
    let passwordInputIndex = getPasswordInputIndex(inputs);

    if (passwordInputIndex > 0)
      formInputs.push(inputs[passwordInputIndex - 1]);
    for (let i = passwordInputIndex; i < inputs.length; i++){
      const input = inputs[i];
      if (input.type === 'password')
        formInputs.push(input);
    };
    form.inputs = formInputs;
    formInputs.forEach(item => {
      this.setupConnectionInput(item);
    });
  };
  hideForm = (form) => {
    const inputs = this.state.inputs.filter(item => {
      return !(form.inputs.includes(item.input));
    });
    this.setState({inputs: inputs});
  };
  checkForms = () => {
    this.forms = this.forms.map(form => {
      const isVisible = $(form.formEl).is(':visible');
      if (form.isVisible && !isVisible){
        form.isVisible = isVisible;
        this.hideForm(form);
      }else if (!form.isVisible && isVisible){
        form.isVisible = isVisible;
        this.describeForms(form);
      }
      return form;
    });
  };
  collectForms = () => {
    let docForms = document.querySelectorAll('form');
    let forms = [];
    for (let form of docForms){
      if (!form.dataset || !form.dataset.easeWatching){
        form.dataset.easeWatching = 'true';
        if (form.querySelector('input[type=password]')){
          forms.push({
            formEl: form,
            isVisible: false,
            inputs: []
          });
        }
      }
    }
    this.forms = this.forms.concat(forms);
  };
  checkRemovedNodes = (removedNodes) => {
    for (let i = 0; i < removedNodes.length; i++){
      let node = removedNodes[i];
      this.forms = this.forms.filter(item => {
        const toRemove = (node === item.formEl || node.contains(item.formEl));
        if (toRemove)
          this.hideForm(item);
        return !toRemove;
      });
    }
  };
  domObserverFunction = (mutations) => {
    if (!mutations || !mutations.length)
      return;
    let doCollect = false;
    for (let i = 0; i < mutations.length; i++) {
      if (!!mutations[i].removedNodes.length)
        this.checkRemovedNodes(mutations[i].removedNodes);
      if (!mutations[i].addedNodes || !mutations[i].addedNodes.length) {
        continue;
      }
      if (doCollect)
        continue;
      for (let j = 0; j < mutations[i].addedNodes.length; j++) {
        let addedNode = mutations[i].addedNodes[j];
        if (!addedNode)
          continue;
        if (addedNode.tagName && addedNode.tagName.toLowerCase() === 'form' &&
            (!addedNode.dataset || !addedNode.dataset.easeWatching)) {
          doCollect = true;
          break;
        }
        if (!addedNode.querySelectorAll)
          continue;
        let forms = mutations[i].addedNodes[j].querySelectorAll('form:not([data-ease-watching])');
        if (forms && forms.length) {
          doCollect = true;
          break;
        }
      }
    }
    if (doCollect){
      if (!!this.domObservationCollectTimeout)
        clearTimeout(this.domObservationCollectTimeout);
      this.domObservationCollectTimeout = setTimeout(this.collectForms, 1000);
    }
  };
  onResize = () => {
    const inputs = this.state.inputs.map(input => {
      return {
        input: input.input,
        iconPosition: this.getInputIconPosition(input.input)
      }
    });
    this.setState({inputs: inputs});
  };
  componentDidMount(){
    setTimeout(() => {
      this.collectForms();
      this.checkForms();
      this.formObservationInterval = setInterval(this.checkForms, 500);
      let bodies = document.querySelectorAll('body');
      if (!!bodies.length) {
        let observer = new window.MutationObserver(this.domObserverFunction);
        observer.observe(bodies[0], {childList: true, subtree:true});
      }
      document.addEventListener('scroll', this.onResize, true);
      window.addEventListener('resize', this.onResize);
    }, 700);
  }
  componentWillUnmount(){
    document.removeEventListener('scroll', this.onResize, true);
    window.removeEventListener('resize', this.onResize);
    clearInterval(this.formObservationInterval);
  }
  render(){
    return (
        <Fragment>
          {this.state.inputs.map((item, idx) => {
            return (
                <ConnectionInputIcon
                    key={idx}
                    onClick={this.openListener.bind(null, item.input)}
                    style={item.iconPosition}/>
            )
          })}
          {!!this.state.currentInput &&
          <FillInPopup
              closeMenu={this.closeFillInMenu}
              target={this.state.currentInput}/>}
        </Fragment>
    );
  }
}

export default ConnectionInputsListener;
import React, {Fragment, Component} from "react";
import "../../../shared/browser";
import {EaseInputLogoIconActive, EaseInputLogoIcon} from "../../../shared/ImagesBase64";
import Storage from "../../../shared/storage_api";
import FillInPopup from "./fillInPopup";

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
    isVisible: $(form).is(':visible'),
    loginEl: loginEl,
    passwordEl: passwordEl
  }
}

class ConnectionInputsListener extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentInput: null,
      inputs: []
    };
    this.domObservationCollectTimeout = null;
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
    console.log('closing fill in menu');
    this.removeCloseListeners();
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
  checkForm = (form) => {
    let inputs = getVisibleInputs(form);
    let loginEl = null;
    let passwordEl = null;
    let passwordIndex = getPasswordInputIndex(inputs);
    if (passwordIndex > -1)
      passwordEl = inputs[passwordIndex];
    if (passwordIndex > 0){
      loginEl = inputs[passwordIndex - 1];
    }
    if (!!passwordEl){
      this.forms.push({
        formEl: form,
        isVisible: false,
        loginEl: loginEl,
        passwordEl: passwordEl
      });
    }
  };
  collectForms = () => {
    let docForms = document.querySelectorAll('form');
    let forms = [];

    for (let form of docForms){
      if (!form.dataset || !form.dataset.easeWatching) {
        form.dataset.easeWatching = 'true';
        this.checkForm(form);
      }
    }
    this.forms.map((form) => {
      if (form.isVisible) {
        if (!!form.loginEl)
          this.setupConnectionInput(form.loginEl);
        this.setupConnectionInput(form.passwordEl);
      }
    });
  };
  checkRemovedNodes = (removedNodes) => {
    let inputs = this.state.inputs.slice();
    let elementsRemoved = false;
    for (let i = 0; i < removedNodes.length; i++){
      let node = removedNodes[i];
      inputs = inputs.filter((item) => {
        const toRemove = node === item.input || node.contains(item.input);
        if (toRemove)
          elementsRemoved = true;
        return !toRemove;
      });
    }
    if (elementsRemoved)
      this.setState({inputs: inputs});
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
    this.collectForms();
    let bodies = document.querySelectorAll('body');
    if (!!bodies.length) {
      let observer = new window.MutationObserver(this.domObserverFunction);
      observer.observe(bodies[0], {childList: true, subtree:true});
    }
    document.addEventListener('scroll', this.onResize, true);
    window.addEventListener('resize', this.onResize);
    console.log('connection input listener did mount');
  }
  componentWillUnmount(){
    document.removeEventListener('scroll', this.onResize, true);
    window.removeEventListener('resize', this.onResize);
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
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

const getLastPasswordInputIndex = (inputs) => {
  for (let i = 0; i < inputs.length; i++){
    if (inputs[i].type === 'password')
      return i;
  }
  return -1;
};

class FormSubmissionListener extends Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
    console.log('mounted');
    $(document).on('submit', 'form', (e) => {
      let account = {};
      let inputs = getVisibleInputs({
        form: e.target
      });
      let pwdIndex = getLastPasswordInputIndex(inputs);
      if (inputs.length < 2 || pwdIndex < 1)
        return;
      account.password = inputs[pwdIndex].value;
      account.login = inputs[pwdIndex - 1].value;
      if (!account.password || !account.login)
        return;
      Runtime.sendMessage(null, {type: 'formSubmission', data: {account: account, websiteName: document.location.hostname}}, null);
    });
  }
  render(){
    return null
  }
}

export default FormSubmissionListener;
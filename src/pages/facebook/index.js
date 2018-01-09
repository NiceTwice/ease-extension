import $ from "jquery";
import "../../shared/browser";
import Runtime from "../../shared/runtime_api";

console.log('ease on facebook');
if(document.getElementById("email")){
  Runtime.sendMessage(null,{
    type: 'setAccountDisconnected',
    data: {
      websiteName: "www.facebook.com"
    }
  }
  ,null);
}

$(document).on('submit', 'form', (e) => {
  let form = $(this);
  let account = {};
  let visibleFields = 0;
  console.log(form[0]);
  let fields = e.target.getElementsByTagName('input');
  console.log('fields', fields);
  for (let i = 0; i < fields.length; i++){
    const input = fields[i];
    if ($(input).is(':visible') && input.type !== 'checkbox' && input.type !== 'submit'){
      visibleFields++;
      if (input.type === 'password')
        account.password = input.value;
      else if (input.type !== 'password')
        account.login = input.value;
    }
  }
  if (visibleFields !== 2 || !account.login || !account.password)
    return;
  Runtime.sendMessage(null, {type: 'setAccountConnected', data: {account: account, websiteName: document.location.hostname}}, null);
});

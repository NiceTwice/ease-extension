import React, {Component, Fragment} from "react";
import {Icon, Popup} from "semantic-ui-react";
import {copyTextToClipboard} from "../../../shared/utils";

function generatePassword(length) {
  let password = '', character;
  while (length > password.length) {
    if (password.indexOf(character = String.fromCharCode(Math.floor(Math.random() * 94) + 33), Math.floor(password.length / 94) * 94) < 0) {
      password += character;
    }
  }
  return password;
}

class GeneratedPasswordString extends Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
    this.span.click();
    this.span.select();
  }
  componentDidUpdate(){
    setTimeout(() => {
      this.span.click();
      this.span.select();
    }, 10);
  }
  render(){
    const {password} = this.props;
    return (
        <Popup
            size="mini"
            className="password_generator_popup"
            position="top center"
            inverted
            on="click"
            hideOnScroll
            trigger={
              <input
                  style={{
                    background: 'none',
                    border: 'none',
                    textAlign: 'center'
                  }}
                  ref={(item) => {this.span = item;}}
                  onClick={e => {copyTextToClipboard(password)}}
                  value={password}
                  readOnly/>
            }
            content="Copied"
        />
    )
  }
}

class StrongPasswordGenerator extends Component {
  constructor(props){
    super(props);
    this.state = {
      password: ''
    }
  }
  generate = () => {
    const password = generatePassword(18);
    this.setState({password: password});
  };
  render(){
    return (
        <div id="strong_password_generator">
          {!!this.state.password.length ?
              <Fragment>
                <GeneratedPasswordString password={this.state.password}/>
                <span class="renew" onClick={this.generate}><Icon name="refresh"/>New</span>
              </Fragment>
              :
              <span
                  style={{cursor: 'pointer'}}
                  onClick={this.generate}>Generate a strong password <Icon name="magic"/></span>}
        </div>
    )
  }
}

export default StrongPasswordGenerator;
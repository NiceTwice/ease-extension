import React, {Component, Fragment} from "react";
import update from 'immutability-helper';
import {Dropdown, Icon, Header, Input, Button, Form, Table, Accordion, TextArea, Checkbox} from "semantic-ui-react";
import {websiteNameChanged, websiteHomeChanged} from "../../../../shared/actions/websiteIntegration";
import {connect} from "react-redux";

function toggleAccordion() {
  this.setState({active: !this.state.active});
};

const actions = [
  {action: 'fill', what: '', grave: true}
];

const options = [
  {
    text: 'login',
    value: 'login'
  },
  {
    text:'password',
    value: 'password'
  }
];

class LoginSteps extends Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
        <Table compact celled color={'red'}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                Login steps
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>
                <FillStep/>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <ClickStep/>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
          <Table.Footer fullWidth>
            <Table.Row>
              <Table.HeaderCell>
                <Dropdown selection fluid/>
                <Button content={'add this step'} fluid/>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
    )
  }
}

class FillStep extends Component {
  constructor(props){
    super(props);
    this.state = {
      active: false
    }
  }
  toggle = toggleAccordion.bind(this);
  render(){
    return (
        <Accordion>
          <Accordion.Title active={this.state.active} onClick={this.toggle}>
            <Icon name="dropdown"/>
            Fill
          </Accordion.Title>
          <Accordion.Content active={this.state.active}>
            <Form as="div">
              <Form.TextArea label="Selector" value=".bite .pute .pppute"/>
              <Form.Checkbox label="Critical" checked={true}/>
              <Form.Dropdown label="Connection info" selection options={options} fluid placeholder={'Choose info to fill'}/>
            </Form>
          </Accordion.Content>
        </Accordion>
    )
  }
}

class ClickStep extends Component {
  constructor(props){
    super(props);
    this.state ={
      active: false
    }
  }
  toggle = toggleAccordion.bind(this);
  render(){
    return (
        <Accordion>
          <Accordion.Title active={this.state.active} onClick={this.toggle}>
            <Icon name="dropdown"/>
            Click
          </Accordion.Title>
          <Accordion.Content active={this.state.active}>
            <Form as="div">
              <Form.TextArea label="Selector" value=".bite .pute .pppute"/>
              <Form.Checkbox label="Critical" checked={true}/>
            </Form>
          </Accordion.Content>
        </Accordion>
    )
  }
}

class WaitforStep extends Component {
  constructor(props){
    super(props);
    this.state = {
      active: false
    }
  }
  toggle = toggleAccordion.bind(this);
  render(){
    return (
        <Accordion>
          <Accordion.Title active={this.state.active} onClick={this.toggle}>
            <Icon name="dropdown"/>
            Waitfor
          </Accordion.Title>
          <Accordion.Content active={this.state.active}>
            <Form as="div">
              <Form.TextArea label="Selector" value=".bite .pute .pppute"/>
            </Form>
          </Accordion.Content>
        </Accordion>
    )
  }
}

class EnterFrameStep extends Component {
  constructor(props){
    super(props);
    this.state = {
      active: false
    }
  }
  toggle = toggleAccordion.bind(this);
  render(){
    return (
        <Accordion>
          <Accordion.Title active={this.state.active} onClick={this.toggle}>
            <Icon name="dropdown"/>
            EnterFrame
          </Accordion.Title>
          <Accordion.Content active={this.state.active}>
            <Form as="div">
              <Form.TextArea label="Selector" value=".bite .pute .pppute"/>
            </Form>
          </Accordion.Content>
        </Accordion>
    )
  }
}

class LeaveFrameStep extends Component {
  constructor(props){
    super(props);
    this.state = {
      active: false
    }
  }
  toggle = toggleAccordion.bind(this);
  render(){
    return (
        <Accordion>
          <Accordion.Title active={this.state.active} onClick={this.toggle}>
            <Icon name="dropdown"/>
            LeaveFrame
          </Accordion.Title>
          <Accordion.Content active={this.state.active}>
            {/*<Form as="div">
              <Form.TextArea label="Selector" value=".bite .pute .pppute"/>
            </Form>*/}
          </Accordion.Content>
        </Accordion>
    )
  }
}

class EraseCookieStep extends Component {
  constructor(props){
    super(props);
    this.state = {
      active: false
    }
  }
  toggle = toggleAccordion.bind(this);
  render(){
    return (
        <Accordion>
          <Accordion.Title active={this.state.active} onClick={this.toggle}>
            <Icon name="dropdown"/>
            EraseCookie
          </Accordion.Title>
          <Accordion.Content active={this.state.active}>
            <Form as="div">
              <Form.Input label="Name" value="c_user" fluid/>
            </Form>
          </Accordion.Content>
        </Accordion>
    )
  }
}

class GotoStep extends Component {
  constructor(props){
    super(props);
    this.state = {
      active: false
    }
  }
  toggle = toggleAccordion.bind(this);
  render(){
    return (
        <Accordion>
          <Accordion.Title active={this.state.active} onClick={this.toggle}>
            <Icon name="dropdown"/>
            Goto
          </Accordion.Title>
          <Accordion.Content active={this.state.active}>
            <Form as="div">
              <Form.Input label="Url" value="https://facebook.com" fluid/>
            </Form>
          </Accordion.Content>
        </Accordion>
    )
  }
}

class SearchStep extends Component {
  constructor(props){
    super(props);
    this.state = {
      active: false
    }
  }
  toggle = toggleAccordion.bind(this);
  render(){
    return (
        <Accordion>
          <Accordion.Title active={this.state.active} onClick={this.toggle}>
            <Icon name="dropdown"/>
            Search
          </Accordion.Title>
          <Accordion.Content active={this.state.active}>
            <Form as="div">
              <Form.TextArea label="Selector" value=".bite .pute .pppute"/>
            </Form>
          </Accordion.Content>
        </Accordion>
    )
  }
}

@connect(store => ({
  websiteIntegrationBar : store.websiteIntegrationBar
}))
class WebsiteIntegrationBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      websiteName: '',
      websiteHome: '',
      loginSteps: [],
      logoutSteps: [],
      checkAlreadyLoggedSteps: [],
      styles : {
        transform: "translateX(-100%)"
      }
    }
  }
  componentDidMount(){
    setTimeout(() => {
      this.setState({styles: {
        transform: 'translateX(0)'
      }});
    }, 10);
  }
  changeWebsiteName = (e) => {
    this.props.dispatch(websiteNameChanged({
      tabId: this.props.tabId,
      websiteName: e.target.value
    }))
  };
  changeWebsiteHome = (e) => {
    this.props.dispatch(websiteHomeChanged({
      tabId: this.props.tabId,
      websiteHome: e.target.value
    }));
  };
  render(){
    const {websiteIntegrationBar,tabId} = this.props;
    const info = websiteIntegrationBar[tabId];

    return (
        <div class="display_flex flex_direction_column" style={this.state.styles} id="websiteIntegrationBar">
          <Header as="h3" icon textAlign="center">
            <Icon name='lab' circular />
            <Header.Content>
              Website integration
            </Header.Content>
          </Header>
          <Form>
            <Form.Field>
              <Input label="Name"
                     placeholder="Facebook"
                     value={info.websiteName}
                     onChange={this.changeWebsiteName}/>
            </Form.Field>
            <Form.Field>
              <Input label="Home"
                     value={info.websiteHome}
                     onChange={this.changeWebsiteHome}
                     placeholder="https://facebook.com"/>
            </Form.Field>
            <Form.Field>
              <Table compact celled textAlign={'center'} color={'green'}>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>
                      Connection information
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>
                      login
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      password
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
                <Table.Footer fullWidth>
                  <Table.Row>
                    <Table.HeaderCell>
                      <Input label="New" placeholder="SIRET number"/>
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Footer>
              </Table>
            </Form.Field>
            <Form.Field>
              <LoginSteps/>
            </Form.Field>
            <Form.Field>

            </Form.Field>
            <Form.Field>

            </Form.Field>
          </Form>
        </div>
    )
  }
}

export default WebsiteIntegrationBar;
import React, {Component, Fragment} from "react";
import classnames from "classnames";
import {Dropdown,Divider,Tab, Icon, Header, Input, Button, Form, Table, Accordion, TextArea, Checkbox} from "semantic-ui-react";
import * as wi from "../../../../shared/actions/websiteIntegration";
import {copyTextToClipboard, TabMessage} from "../../../../shared/utils";
import {connect} from "react-redux";

let tabId = -1;

function toggleAccordion() {
  this.setState({active: !this.state.active});
};

const actions = {
  fill: {action: 'fill', what: '', search: '', grave: true},
  click: {action: 'click', search: '', grave: true },
  waitfor: {action: 'waitfor', search: ''},
  enterFrame: {action: 'enterFrame', search: ''},
  leaveFrame: {action: 'leaveFrame'},
  erasecookies: {action: 'erasecookies', name: ''},
  goto: {action: 'goto', url: ''},
  waitload: {action: 'waitload'}
};

const StepChooserDropdown = ({chooseStep, color}) => {
  return (
      <Dropdown floating
                fluid
                upward
                button
                color={color}
                icon={null}
                class={classnames('icon attached bottom add_new', !!color ? color : null)}
                text={<Fragment><Icon name="add"/>Add a new step</Fragment>}>
        <Dropdown.Menu>
          <Dropdown.Item icon="pencil" text="Fill" onClick={chooseStep.bind(null, 'fill')}/>
          <Dropdown.Item icon="mouse pointer" text="Click" onClick={chooseStep.bind(null, 'click')}/>
          <Dropdown.Item icon="wait" text="Waitfor" onClick={chooseStep.bind(null, 'waitfor')}/>
          <Dropdown.Item icon="sign in" text="Enter frame" onClick={chooseStep.bind(null, 'enterFrame')}/>
          <Dropdown.Item icon="sign out" text="Leave frame" onClick={chooseStep.bind(null, 'leaveFrame')}/>
          <Dropdown.Item icon="erase" text="Erase cookie" onClick={chooseStep.bind(null, 'erasecookies')}/>
          <Dropdown.Item icon="internet explorer" text="Go to url" onClick={chooseStep.bind(null, 'goto')}/>
          <Dropdown.Item icon="spinner" text="Wait page loading" onClick={chooseStep.bind(null, 'waitload')}/>
        </Dropdown.Menu>
      </Dropdown>
  )
};

const getActionComponent = (name, props) => {
  switch (name) {
    case 'fill':
      return <FillAction {...props}/>;
      break;
    case 'click':
      return <ClickAction {...props}/>;
      break;
    case 'waitfor':
      return <WaitforAction {...props}/>;
      break;
    case 'enterFrame':
      return <EnterFrameAction {...props}/>;
      break;
    case 'leaveFrame':
      return <LeaveFrameAction {...props}/>;
      break;
    case 'erasecookies':
      return <EraseCookieAction {...props}/>;
      break;
    case 'goto':
      return <GotoAction {...props}/>;
      break;
    case 'waitload':
      return <WaitLoadAction {...props}/>;
      break;
    default:
      return null;
  }
};

@connect()
class LoginSteps extends Component {
  constructor(props){
    super(props);
  }
  addStep = (name) => {
    this.props.dispatch(wi.websiteAddLoginStep({
      tabId: this.props.tabId,
      step: actions[name]
    }));
  };
  stepParamChanged = (stepIndex, paramName, paramValue) => {
    this.props.dispatch(wi.websiteLoginStepChanged({
      tabId: this.props.tabId,
      stepIndex: stepIndex,
      stepParamName: paramName,
      stepParamValue: paramValue
    }));
  };
  removeStep = (stepIndex) => {
    this.props.dispatch(wi.websiteLoginStepRemoved({
      tabId: this.props.tabId,
      stepIndex: stepIndex
    }));
  };
  render(){
    const {steps} = this.props;

    return (
        <Table compact celled color="green">
          <Table.Body class="action_list">
            {steps.map((action, idx) => {
              return (
                  <Table.Row key={idx} class="action_section">
                    <Icon name="trash outline"
                          fitted
                          title="remove this action"
                          class="delete_button"
                          onClick={this.removeStep.bind(null, idx)}
                          link/>
                    <Table.Cell>
                      {getActionComponent(action.action, {
                        action: action,
                        idx: idx,
                        paramChanged: this.stepParamChanged
                      })}
                    </Table.Cell>
                  </Table.Row>
              )
            })}
          </Table.Body>
          <StepChooserDropdown color="green" chooseStep={this.addStep}/>
        </Table>
    )
  }
}

@connect()
class LogoutSteps extends Component {
  constructor(props){
    super(props);
  }
  addStep = (name) => {
    this.props.dispatch(wi.websiteAddLogoutStep({
      tabId: this.props.tabId,
      step: actions[name]
    }));
  };
  stepParamChanged = (stepIndex, paramName, paramValue) => {
    this.props.dispatch(wi.websiteLogoutStepChanged({
      tabId: this.props.tabId,
      stepIndex: stepIndex,
      stepParamName: paramName,
      stepParamValue: paramValue
    }));
  };
  removeStep = (stepIndex) => {
    this.props.dispatch(wi.websiteLogoutStepRemoved({
      tabId: this.props.tabId,
      stepIndex: stepIndex
    }));
  };
  render(){
    const {steps} = this.props;

    return (
        <Table compact celled color="green">
          <Table.Body class="action_list">
            {steps.map((action, idx) => {
              return (
                  <Table.Row key={idx} class="action_section">
                    <Icon name="trash outline"
                          fitted
                          title="remove this action"
                          class="delete_button"
                          onClick={this.removeStep.bind(null, idx)}
                          link/>
                    <Table.Cell>
                      {getActionComponent(action.action, {
                        action: action,
                        idx: idx,
                        paramChanged: this.stepParamChanged
                      })}
                    </Table.Cell>
                  </Table.Row>
              )
            })}
          </Table.Body>
          <StepChooserDropdown color="green" chooseStep={this.addStep}/>
        </Table>
    )
  }
}

@connect()
class CheckAlreadyLoggedSteps extends Component {
  constructor(props){
    super(props);
  }
  addStep = (name) => {
    this.props.dispatch(wi.websiteAddCheckAlreadyLoggedStep({
      tabId: this.props.tabId,
      step: actions[name]
    }));
  };
  stepParamChanged = (stepIndex, paramName, paramValue) => {
    this.props.dispatch(wi.websiteCheckAlreadyLoggedStepChanged({
      tabId: this.props.tabId,
      stepIndex: stepIndex,
      stepParamName: paramName,
      stepParamValue: paramValue
    }));
  };
  removeStep = (stepIndex) => {
    this.props.dispatch(wi.websiteCheckAlreadyLoggedStepRemoved({
      tabId: this.props.tabId,
      stepIndex: stepIndex
    }));
  };
  checkSelectorChanged = (e) => {
    this.props.dispatch(wi.websiteCheckAlreadyLoggedSelectorChanged({
      tabId: this.props.tabId,
      selector: e.target.value
    }))
  };
  startSelection = () => {
    TabMessage(tabId, 'pick_click_element_selector').then(selector => {
      this.props.dispatch(wi.websiteCheckAlreadyLoggedSelectorChanged({
        tabId: tabId,
        selector: selector
      }))
    });
  };
  render(){
    const {steps, checkSelector} = this.props;

    return (
        <Table compact celled color="green">
          <Table.Body class="action_list">
            {steps.map((action, idx) => {
              return (
                  <Table.Row key={idx} class="action_section">
                    <Icon name="trash outline"
                          fitted
                          title="remove this action"
                          class="delete_button"
                          onClick={this.removeStep.bind(null, idx)}
                          link/>
                    <Table.Cell>
                      {getActionComponent(action.action, {
                        action: action,
                        idx: idx,
                        paramChanged: this.stepParamChanged
                      })}
                    </Table.Cell>
                  </Table.Row>
              )
            })}
            <Table.Row>
              <Table.Cell>
                <label>Check selector <Icon name="magic" link onClick={this.startSelection}/></label>
                <TextArea placeholder="CSS selector"
                          onChange={this.checkSelectorChanged}
                          value={checkSelector}/>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
          <StepChooserDropdown color="green" chooseStep={this.addStep}/>
        </Table>
    )
  }
}

class FillAction extends Component {
  constructor(props){
    super(props);
    this.state = {
      active: false
    }
  }
  toggle = toggleAccordion.bind(this);
  startSelection = () => {
    const {idx, paramChanged} = this.props;

    TabMessage(tabId, 'pick_fill_element_selector').then(selector => {
      paramChanged(idx, 'search', selector);
    });
  };
  render(){
    const {action, idx, paramChanged} = this.props;

    return (
        <Accordion>
          <Accordion.Title active={this.state.active} onClick={this.toggle}>
            <Icon name="dropdown"/>
            Fill
          </Accordion.Title>
          <Accordion.Content active={this.state.active}>
            <Form as="div">
              <Form.TextArea label={<label>Selector <Icon name="wizard" link onClick={this.startSelection} title="Pick manually"/></label>}
                             placeholder="CSS selector"
                             onChange={(e) => {
                               paramChanged(idx, 'search', e.target.value);
                             }}
                             value={action.search}/>
              <Form.Checkbox label="Critical"
                             onChange={(e, {checked}) => {
                               paramChanged(idx, 'grave', checked);
                             }}
                             checked={action.grave}/>
              <Form.Input label="Connection info to fill"
                          placeholder="Connection info name"
                          fluid
                          value={action.what}
                          onChange={(e) => {
                            paramChanged(idx, 'what', e.target.value);
                          }}/>
            </Form>
          </Accordion.Content>
        </Accordion>
    )
  }
}

class ClickAction extends Component {
  constructor(props){
    super(props);
    this.state ={
      active: false
    }
  }
  toggle = toggleAccordion.bind(this);
  startSelection = () => {
    const {idx, paramChanged} = this.props;

    TabMessage(tabId, 'pick_click_element_selector').then(selector => {
      paramChanged(idx, 'search', selector);
    });
  };
  render(){
    const {action, idx, paramChanged} = this.props;

    return (
        <Accordion>
          <Accordion.Title active={this.state.active} onClick={this.toggle}>
            <Icon name="dropdown"/>
            Click
          </Accordion.Title>
          <Accordion.Content active={this.state.active}>
            <Form as="div">
              <Form.TextArea label={<label>Selector <Icon name="wizard" link onClick={this.startSelection} title="Pick manually"/></label>}
                             placeholder="CSS selector"
                             onChange={(e) => {
                               paramChanged(idx, 'search', e.target.value);
                             }}
                             value={action.search}/>
              <Form.Checkbox label="Critical"
                             onChange={(e, {checked}) => {
                               paramChanged(idx, 'grave', checked);
                             }}
                             checked={action.grave}/>
            </Form>
          </Accordion.Content>
        </Accordion>
    )
  }
}

class WaitforAction extends Component {
  constructor(props){
    super(props);
    this.state = {
      active: false
    }
  }
  toggle = toggleAccordion.bind(this);
  startSelection = () => {
    const {idx, paramChanged} = this.props;

    TabMessage(tabId, 'pick_click_element_selector').then(selector => {
      paramChanged(idx, 'search', selector);
    });
  };
  render(){
    const {action, idx, paramChanged} = this.props;

    return (
        <Accordion>
          <Accordion.Title active={this.state.active} onClick={this.toggle}>
            <Icon name="dropdown"/>
            Waitfor
          </Accordion.Title>
          <Accordion.Content active={this.state.active}>
            <Form as="div">
              <Form.TextArea label={<label>Selector <Icon name="wizard" link onClick={this.startSelection} title="Pick manually"/></label>}
                             placeholder="CSS selector"
                             onChange={(e) => {
                               paramChanged(idx, 'search', e.target.value);
                             }}
                             value={action.search}/>
            </Form>
          </Accordion.Content>
        </Accordion>
    )
  }
}

class EnterFrameAction extends Component {
  constructor(props){
    super(props);
    this.state = {
      active: false
    }
  }
  toggle = toggleAccordion.bind(this);
  render(){
    const {action, idx, paramChanged} = this.props;

    return (
        <Accordion>
          <Accordion.Title active={this.state.active} onClick={this.toggle}>
            <Icon name="dropdown"/>
            EnterFrame
          </Accordion.Title>
          <Accordion.Content active={this.state.active}>
            <Form as="div">
              <Form.TextArea label="Selector"
                             placeholder="CSS selector"
                             onChange={(e) => {
                               paramChanged(idx, 'search', e.target.value);
                             }}
                             value={action.search}/>
            </Form>
          </Accordion.Content>
        </Accordion>
    )
  }
}

class LeaveFrameAction extends Component {
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
          </Accordion.Content>
        </Accordion>
    )
  }
}

class WaitLoadAction extends Component {
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
            Waitload
          </Accordion.Title>
          <Accordion.Content active={this.state.active}>
          </Accordion.Content>
        </Accordion>
    )
  }
}

class EraseCookieAction extends Component {
  constructor(props){
    super(props);
    this.state = {
      active: false
    }
  }
  toggle = toggleAccordion.bind(this);
  render(){
    const {action, idx, paramChanged} = this.props;

    return (
        <Accordion>
          <Accordion.Title active={this.state.active} onClick={this.toggle}>
            <Icon name="dropdown"/>
            EraseCookie
          </Accordion.Title>
          <Accordion.Content active={this.state.active}>
            <Form as="div">
              <Form.Input label="Name"
                          placeholder="Cookie name"
                          value={action.name}
                          onChange={(e) => {
                            paramChanged(idx, 'name', e.target.value)
                          }}
                          fluid/>
            </Form>
          </Accordion.Content>
        </Accordion>
    )
  }
}

class GotoAction extends Component {
  constructor(props){
    super(props);
    this.state = {
      active: false
    }
  }
  toggle = toggleAccordion.bind(this);
  render(){
    const {action, idx, paramChanged} = this.props;

    return (
        <Accordion>
          <Accordion.Title active={this.state.active} onClick={this.toggle}>
            <Icon name="dropdown"/>
            Goto
          </Accordion.Title>
          <Accordion.Content active={this.state.active}>
            <Form as="div">
              <Form.Input label="Url"
                          placeholder="Url"
                          value={action.url}
                          onChange={(e) => {
                            paramChanged(idx, 'url', e.target.value);
                          }}
                          fluid/>
            </Form>
          </Accordion.Content>
        </Accordion>
    )
  }
}

class SearchAction extends Component {
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
              <Form.TextArea
                  placeholder="CSS selector"
                  label="Selector"
                  value=".bite .pute .pppute"/>
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
      },
      jsonCopied: false
    }
  }
  componentDidMount(){
    setTimeout(() => {
      this.setState({styles: {
        transform: 'translateX(0)'
      }});
    }, 10);
    tabId = this.props.tabId;
  }
  changeWebsiteName = (e) => {
    this.props.dispatch(wi.websiteNameChanged({
      tabId: this.props.tabId,
      websiteName: e.target.value
    }))
  };
  changeWebsiteHome = (e) => {
    this.props.dispatch(wi.websiteHomeChanged({
      tabId: this.props.tabId,
      websiteHome: e.target.value
    }));
  };
  generateJson = () => {
    const {websiteIntegrationBar,tabId} = this.props;
    const info = websiteIntegrationBar[tabId];
    let checkAlreadyLoggedSteps = info.checkAlreadyLoggedSteps.slice();
    checkAlreadyLoggedSteps.push({search: info.checkAlreadyLoggedSelector});

    let json = {
      name: info.websiteName,
      home: info.websiteHome,
      conect: {
        todo: info.loginSteps
      },
      logout: {
        todo: info.logoutSteps
      },
      checkAlreadyLogged: checkAlreadyLoggedSteps
    };

    const prettyJson = JSON.stringify(json, null, 2);
    copyTextToClipboard(prettyJson);
    this.setState({jsonCopied: true});
    setTimeout(() => {
      this.setState({jsonCopied: false});
    }, 1500);
  };
  render(){
    const {websiteIntegrationBar,tabId} = this.props;
    const info = websiteIntegrationBar[tabId];
    const {jsonCopied} = this.state;
    const panes = [
      {
        menuItem: { key: 'Login', icon: 'sign in', content: 'Login' },
        render: () => (<Tab.Pane>
          <LoginSteps tabId={tabId}
                      steps={info.loginSteps}/>
        </Tab.Pane>),
      },
      {
        menuItem: { key: 'Logout', icon: 'sign out', content: 'Logout' },
        render: () => (<Tab.Pane>
          <LogoutSteps tabId={tabId}
                       steps={info.logoutSteps}/>
        </Tab.Pane>),
      },
      {
        menuItem: { key: 'IsLogged', icon: 'help', content: 'IsLogged' },
        render: () => (<Tab.Pane>
          <CheckAlreadyLoggedSteps tabId={tabId}
                                   checkSelector={info.checkAlreadyLoggedSelector}
                                   steps={info.checkAlreadyLoggedSteps}/>
        </Tab.Pane>),
      }
    ];

    return (
        <div class="display_flex flex_direction_column" style={this.state.styles} id="websiteIntegrationBar">
          <Header as="h3" icon textAlign="center">
            <Icon name='lab' circular />
            <Header.Content>
              Website integration
            </Header.Content>
          </Header>
          <Form class="full_flex">
            <Form.Input label="Website name"
                        value={info.websiteName}
                        onChange={this.changeWebsiteName}
                        placeholder="Facebook"/>
            <Form.Input label="Website login url"
                        value={info.websiteHome}
                        onChange={this.changeWebsiteHome}
                        placeholder="https://facebook.com"/>
            <Divider hidden />
            <Form.Field class="full_flex">
              <Tab class="actions_tab" menu={{secondary: true}} panes={panes}/>
            </Form.Field>
            <Divider hidden />
          </Form>
          <Button icon={jsonCopied ? 'check' : 'copy'}
                  style={{flexShrink: 0}}
                  onClick={this.generateJson}
                  content={jsonCopied ? 'Copied!' : "Copy JSON description"}
                  fluid/>
        </div>
    )
  }
}

export default WebsiteIntegrationBar;
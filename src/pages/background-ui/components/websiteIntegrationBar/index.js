import React, {Component, Fragment} from "react";
import classnames from "classnames";
import Tabs from "../../../../shared/tabs_api";
import {Label, Dropdown,Divider,Tab, Icon, Header, Input, Button, Form, Table, Accordion, TextArea, Checkbox} from "semantic-ui-react";
import * as wi from "../../../../shared/actions/websiteIntegration";
import {copyTextToClipboard, TabMessage, extractRootDomain, BackgroundMessage} from "../../../../shared/utils";
import {connect} from "react-redux";

let tabId = -1;

function toggleAccordion() {
  this.setState({active: !this.state.active});
};

const actions = {
  fill: {action: 'fill', what: 'login', search: '', grave: true},
  click: {action: 'click', search: '', grave: true },
  waitfor: {action: 'waitfor', search: ''},
  enterFrame: {action: 'enterFrame', search: ''},
  leaveFrame: {action: 'leaveFrame'},
  erasecookies: {action: 'erasecookies', name: ''},
  goto: {action: 'goto', url: ''},
  waitload: {action: 'waitload'}
};

const initClickActionDetector = () => {
  TabMessage(tabId, 'websiteIntegrationBar_startSelection', {});
  return TabMessage(tabId, 'pick_click_element_selector').then(selectorInfo => {
    const selector = selectorInfo.selector;
    if (!!selectorInfo.frameSrc){
      console.log('selected in the frame');
      TabMessage(tabId, 'getOptimizedSelector', `[src="${selectorInfo.frameSrc}"]`, {frameId: 0}).then(response => {
        console.log('selected frame unique selector is', response);
      });
    }
    TabMessage(tabId, 'websiteIntegrationBar_endSelection', {});
    return {action: 'click', grave:true, search: selector};
  }).catch(err => {
    TabMessage(tabId, 'websiteIntegrationBar_endSelection', {});
  });
};

const initFillInActionDetector = () => {
  TabMessage(tabId, 'websiteIntegrationBar_startSelection', {});
  return TabMessage(tabId, 'pick_fill_element_selector').then(selectorInfo => {
    const selector = selectorInfo.selector;
    if (!!selectorInfo.frameSrc){
      console.log('selected in the frame');
      TabMessage(tabId, 'getOptimizedSelector', `[src="${selectorInfo.frameSrc}"]`, {frameId: 0}).then(response => {
        console.log('selected frame unique selector is', response);
      });
    }
    TabMessage(tabId, 'websiteIntegrationBar_endSelection', {});
    return {action: 'fill', grave:true, search: selector, what:'login'};
  }).catch(err => {
    TabMessage(tabId, 'websiteIntegrationBar_endSelection', {});
  });
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
  testSteps = () => {
    const {info} = this.props;
    const connectionInfo = info.chosenConnectionInfo.reduce((acumulator,currentValue) => {
      acumulator[currentValue] = 'test';
      return acumulator;
    }, {});
    const steps = processStepList(info.loginSteps);

    BackgroundMessage('executeActionsList', {
      actions: steps,
      values: connectionInfo,
      home: info.websiteHome
    });
  };
  addStep = (name) => {
    switch (name) {
      case 'click':
        initClickActionDetector().then(response => {
          this.props.dispatch(wi.websiteAddLoginStep({
            tabId: this.props.tabId,
            step: response
          }));
        }).catch(err => {
          this.props.dispatch(wi.websiteAddLoginStep({
            tabId: this.props.tabId,
            step: actions[name]
          }));
        });
        break;
      case 'fill':
        initFillInActionDetector().then(response => {
          this.props.dispatch(wi.websiteAddLoginStep({
            tabId: this.props.tabId,
            step: response
          }));
        }).catch(err => {
          this.props.dispatch(wi.websiteAddLoginStep({
            tabId: this.props.tabId,
            step: actions[name]
          }));
        });
        break;
      default:
        this.props.dispatch(wi.websiteAddLoginStep({
          tabId: this.props.tabId,
          step: actions[name]
        }));
    }
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
    const {steps, info} = this.props;

    return (
        <Fragment>
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
                          info:info,
                          paramChanged: this.stepParamChanged
                        })}
                      </Table.Cell>
                    </Table.Row>
                )
              })}
            </Table.Body>
            <StepChooserDropdown color="green" chooseStep={this.addStep}/>
          </Table>
          <Button basic content="test steps"/>
        </Fragment>
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
    TabMessage(tabId, 'websiteIntegrationBar_startSelection', {}, {frameId: 0});
    TabMessage(tabId, 'pick_click_element_selector').then(selector => {
      this.props.dispatch(wi.websiteCheckAlreadyLoggedSelectorChanged({
        tabId: tabId,
        selector: selector
      }));
      TabMessage(tabId, 'websiteIntegrationBar_endSelection', {}, {frameId: 0});
    }).catch(err => {
      TabMessage(tabId, 'websiteIntegrationBar_endSelection', {}, {frameId: 0});
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
      active: true
    }
  }
  toggle = toggleAccordion.bind(this);
  startSelection = () => {
    const {idx, paramChanged} = this.props;
    TabMessage(tabId, 'websiteIntegrationBar_startSelection', {});
    TabMessage(tabId, 'pick_fill_element_selector').then(selectorInfo => {
      const selector = selectorInfo.selector;
      if (!!selectorInfo.frameSrc){
        console.log('selected in the frame');
        TabMessage(tabId, 'getOptimizedSelector', `[src="${selectorInfo.frameSrc}"]`, {frameId: 0}).then(response => {
          console.log('selected frame unique selector is', response);
        });
      }
      paramChanged(idx, 'search', selector);
      TabMessage(tabId, 'websiteIntegrationBar_endSelection', {});
    }).catch(err => {
      TabMessage(tabId, 'websiteIntegrationBar_endSelection', {});
    });
  };
  render(){
    const {action, idx, paramChanged, info} = this.props;
    const connectionInfoOptions = info.connectionInfo;

    return (
        <Accordion>
          <Accordion.Title active={this.state.active} onClick={this.toggle}>
            <Icon name="dropdown"/>
            Fill
          </Accordion.Title>
          <Accordion.Content active={this.state.active}>
            <Form as="div">
              <Form.TextArea label={<label>Selector <a onClick={this.startSelection} title="Pick manually">choose manually</a></label>}
                             placeholder="CSS selector"
                             onChange={(e) => {
                               paramChanged(idx, 'search', e.target.value);
                             }}
                             value={action.search}/>
              <Form.Checkbox label="Mandatory action"
                             onChange={(e, {checked}) => {
                               paramChanged(idx, 'grave', checked);
                             }}
                             checked={action.grave}/>
              <Form.Dropdown label="Connection info to fill"
                             fluid
                             selection
                             scrolling={false}
                             upward
                             value={action.what}
                             onChange={(e, {value}) => {
                               paramChanged(idx, 'what', value);
                             }}
                             options={connectionInfoOptions}
                             placeholder="Connection info name"/>
            </Form>
          </Accordion.Content>
        </Accordion>
    )
  }
}

class ClickAction extends Component {
  constructor(props){
    super(props);
    this.state = {
      active: true
    }
  }
  toggle = toggleAccordion.bind(this);
  startSelection = () => {
    const {idx, paramChanged} = this.props;
    TabMessage(tabId, 'websiteIntegrationBar_startSelection', {});
    TabMessage(tabId, 'pick_click_element_selector').then(selectorInfo => {
      const selector = selectorInfo.selector;
      if (!!selectorInfo.frameSrc){
        console.log('selected in the frame');
        TabMessage(tabId, 'getOptimizedSelector', `[src="${selectorInfo.frameSrc}"]`, {frameId: 0}).then(response => {
          console.log('selected frame unique selector is', response);
        });
      }
      paramChanged(idx, 'search', selector);
      TabMessage(tabId, 'websiteIntegrationBar_endSelection', {});
    }).catch(err => {
      TabMessage(tabId, 'websiteIntegrationBar_endSelection', {});
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
              <Form.TextArea label={<label>Selector <a onClick={this.startSelection} title="Pick manually">choose manually</a></label>}
                             placeholder="CSS selector"
                             onChange={(e) => {
                               paramChanged(idx, 'search', e.target.value);
                             }}
                             value={action.search}/>
              <Form.Checkbox label="Mandatory action"
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
      active: true
    }
  }
  toggle = toggleAccordion.bind(this);
  startSelection = () => {
    const {idx, paramChanged} = this.props;

    TabMessage(tabId, 'websiteIntegrationBar_startSelection', {}, {frameId: 0});
    TabMessage(tabId, 'pick_click_element_selector').then(selector => {
      paramChanged(idx, 'search', selector);
      TabMessage(tabId, 'websiteIntegrationBar_endSelection', {}, {frameId: 0});
    }).catch(err => {
      TabMessage(tabId, 'websiteIntegrationBar_endSelection', {}, {frameId: 0});
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
              <Form.TextArea label={<label>Selector <a onClick={this.startSelection} title="Pick manually">choose manually</a></label>}
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
      active: true
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
      active: true
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
      active: true
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

const renderConnectionInfoLabel = (item, index, defaultProps) => {
  return <Label>{item.text}{index > 1 && <Icon name="delete" onClick={item.onRemove}/>}</Label>;
};

@connect()
class WebsiteConnectionInfoChooser extends Component {
  constructor(props){
    super(props);
  }
  onAddItem = (e, data) => {
    this.props.dispatch(wi.websiteAddConnectionInfo({
      tabId: tabId,
      connectionInfoName: data.value
    }));
  };
  onRemoveItem = (index) => {
    this.props.dispatch(wi.websiteRemoveConnectionInfo({
      tabId: tabId,
      index: index
    }))
  };
  render(){
    const {connectionInfo, chosenConnectionInfo} = this.props;
    const generatedConnectionInfo = connectionInfo.map((item, index) => {
      return {
        ...item,
        onRemove: this.onRemoveItem.bind(null, index)
      }
    });
    return (
        <Form.Field>
          <label>Connection information</label>
          <Dropdown fluid
                    multiple
                    selection
                    allowAdditions
                    search
                    noResultsMessage="Type new name to add"
                    renderLabel={renderConnectionInfoLabel}
                    onAddItem={this.onAddItem}
                    value={chosenConnectionInfo}
                    placeholder="Connection info"
                    options={generatedConnectionInfo}/>
        </Form.Field>
    )
  }
}

const processStepList = (steps) => {
  let ret = [];
  steps.map(step => {
    if ((step.action === 'click' || step.action === 'fill') && !!step.grave)
      ret.push({action: 'waitfor', search: step.search});
    ret.push(step);
  });
  return ret;
};

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
    const loginSteps = processStepList(info.loginSteps);
    const logoutSteps = processStepList(info.logoutSteps);
    const checkAlreadyLoggedSteps = processStepList(info.checkAlreadyLoggedSteps);

    checkAlreadyLoggedSteps.push({search: info.checkAlreadyLoggedSelector});
    let json = {
      name: info.websiteName,
      home: info.websiteHome,
      connect: {
        todo: loginSteps
      },
      logout: {
        todo: logoutSteps
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
  setupTabUrl = () => {
    Tabs.getCurrent().then(tab => {
      this.props.dispatch(wi.websiteHomeChanged({
        tabId: tab.id,
        websiteHome: tab.url
      }));
    });
  };
  setupTabName = () => {
    Tabs.getCurrent().then(tab => {
      const root = extractRootDomain(tab.url);
      const name = root.split('.')[0].replace(/\b\w/g, l => l.toUpperCase());
      this.props.dispatch(wi.websiteNameChanged({
        tabId: tab.id,
        websiteName: name
      }));
    });
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
                      info={info}
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
            <Form.Field>
              <label>Website name <a title="Parse current page's url"
                                     style={{float: 'right'}}
                                     onClick={this.setupTabName}>Fill with page info</a></label>
              <Input value={info.websiteName}
                     onChange={this.changeWebsiteName}
                     placeholder="Facebook"/>
            </Form.Field>
            <Form.Field>
              <label>Website login url <a style={{float: 'right'}} title="Fill with url of the current page"
                                          onClick={this.setupTabUrl}>Fill with page info</a></label>
              <Form.Input value={info.websiteHome}
                          onChange={this.changeWebsiteHome}
                          placeholder="https://facebook.com"/>
            </Form.Field>
            <WebsiteConnectionInfoChooser connectionInfo={info.connectionInfo}
                                          chosenConnectionInfo={info.chosenConnectionInfo}/>
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
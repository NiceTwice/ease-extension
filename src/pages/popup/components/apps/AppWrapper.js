import React, {Component, Fragment} from "react";
import ClassicApp from "./ClassicApp";
import AnyApp from "./AnyApp";
import LogWithApp from "./LogWithApp";

class AppWrapper extends Component {
  constructor(props){
    super(props);
  }
  renderApp = () => {
    const {app} = this.props;

    switch (app.type){
      case ('classicApp'):
        return <ClassicApp app={app}/>;
      case ('teamSingleApp'):
        if (app.sub_type === 'classic')
          return <ClassicApp app={app}/>;
        else if (app.sub_type === 'any')
          return <AnyApp app={app}/>;
        break;
      case ('teamEnterpriseApp'):
        if (app.sub_type === 'classic')
          return <ClassicApp app={app}/>;
        else if (app.sub_type === 'any')
          return <AnyApp app={app}/>;
        break;
      case ('ssoApp'):
        return <ClassicApp app={app}/>;
      case ('anyApp'):
        return <AnyApp app={app}/>;
      case ('logWithApp'):
        return <LogWithApp app={app}/>;
      default:
        return null;
    }
    return null;
  };
  render(){
    return this.renderApp();
  }
}

export default AppWrapper;
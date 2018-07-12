import * as classnames from 'classnames';

import {BaseWidget, React} from 'jimu-core';
import {AllWidgetProps, appConfigUtils} from 'jimu-core';
import {appServices} from 'jimu-for-builder';
import PortalItem = require('esri/portal/PortalItem');
import './css/style.scss';

interface WState{
  saveState: '' | 'saving' | 'done' | 'error'
}
export default class Widget extends BaseWidget<AllWidgetProps<{}>, WState>{
  appNameRef: HTMLInputElement;

  constructor(props){
    super(props);
    this.state = {saveState: ''};
  }
  componentDidMount(){
  }

  onsaveClick = () => {
    this.setState({saveState: 'saving'});
    appServices.saveApp(this.props.queryObject.id, this.props.appState.appConfig).then(item => {
      this.setState({saveState: 'done'});
    }, err => {
      console.error(err);
      this.setState({saveState: 'error'});
    });
  }

  render(){
    return <div className="save-app">
      <div>Save state: {this.state.saveState}</div>
      <button onClick={this.onsaveClick}>Save</button>
    </div>;
  }
}

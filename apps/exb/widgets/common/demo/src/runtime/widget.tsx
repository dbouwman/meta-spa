// import * as classnames from 'classnames';

import * as classnames from 'classnames';

import {BaseWidget, React, ReactDOM} from 'jimu-core';
import {AllWidgetProps} from 'jimu-core';
import {IMConfig} from '../config';

import { TabContent, TabPane, Nav, NavItem, NavLink, Button, Image} from 'jimu-ui';

import './css/style.scss';

export default class Widget extends BaseWidget<AllWidgetProps<IMConfig>, any>{

  showDiffLog = true;

  constructor(props){
    super(props);

    this.state = {
      activeTab: 'properties'
    };
  }

  componentDidMount(){
    console.log(this.props.id, 'componentDidMount');
  }

  componentWillUnmount(){
    console.log(this.props.id, 'componentWillUnmount');
  }

  toggle = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  };

  onOpen(){
    console.log(this.props.id, 'onOpen');
  }

  onClose(){
    console.log(this.props.id, 'onClose');
  }

  onActive(){
    console.log(this.props.id, 'onActive');
  }

  onDeActive(){
    console.log(this.props.id, 'onDeActive');
  }

  render(){
    console.log(`...Render ${this.props.manifest.name}`);
    
    const TESTIMAGE = require('./assets/webapp.png');
    
    let propsTr = Object.keys(this.props).map((prop, i) => {
      if(['manifest'].indexOf(prop) > -1
        || typeof this.props[prop] === 'string'){
        return <tr key={i}><td>{prop}</td><td>{this.props[prop] && this.props[prop].toString()}</td></tr>;
      }

      return <tr key={i}>
        <td>{prop}</td>
        <td>
          {
            JSON.stringify(this.props[prop], null, 2)
          }
        </td></tr>;
    });

    return <div className="widget-demo">
      <Nav tabs>
        <NavItem><NavLink
          className={classnames({active: this.state.activeTab === 'properties'})}
          onClick={() => this.toggle('properties')}
          >Widget Properties</NavLink></NavItem>
        <NavItem><NavLink
          className={classnames({active: this.state.activeTab === 'fn'})}
          onClick={() => this.toggle('fn')}
        >Widget Functions</NavLink></NavItem>
      </Nav>
      <TabContent activeTab={this.state.activeTab}>
        <TabPane tabId="properties">
          <div className="title">widget name:</div>
          <div className="content">{this.props.nls._widgetLabel}</div>

          <div className="title">widget props:</div>
          <div className="content">
            <table>
              <tbody>{propsTr}</tbody>
            </table>
          </div>
        </TabPane>
        <TabPane tabId="fn">
          <Image src={TESTIMAGE} alt="web app" className="demo-test__image" type="thumbnail" width="200" />
        </TabPane>
      </TabContent>


    </div>;
  }
}

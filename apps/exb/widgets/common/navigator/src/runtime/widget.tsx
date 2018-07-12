import { React } from 'jimu-core';
import { BaseWidget } from 'jimu-core';
import { AllWidgetProps } from 'jimu-core';
import { Link, Nav, NavItem } from 'jimu-ui';
import { IMConfig } from '../config';
import './css/style.scss';
import * as queryString from 'query-string';

interface State {
  selectedIndex: number
}

export default class Widget extends BaseWidget<AllWidgetProps<IMConfig>, State>{
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: -1
    }
  }

  handleClick = (evt, index) => {
    evt.nativeEvent.stopImmediatePropagation();
    this.setState({ selectedIndex: index });
  }

  render() {
    const { selectedIndex } = this.state;

    let children;
    let links = this.props.config.links;
    if (!links || !links.length) {
      children = <div>No valid link</div>;
    } else {
      let queryObject = this.props.queryObject;

      children = links.map((link, index) => {
        let name = link.name;
        let views = link.views || [];
        let search = '', viewStr = views.join(',');
        if (queryObject) {
          search = '?' + queryString.stringify(queryObject.set("views", viewStr));
        } else {
          search += '?views=' + viewStr;
        }
        return <NavItem key={index} onClick={evt => this.handleClick(evt, index)} active={selectedIndex === index}>
          <Link to={search}>{name}</Link>
        </NavItem>
      })
    }
    
    return <div className="widget-navigator">
      <Nav>{children}</Nav>
    </div>
  }
}
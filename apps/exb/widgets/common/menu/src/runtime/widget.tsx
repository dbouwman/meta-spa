import { React } from 'jimu-core';
import { BaseWidget } from 'jimu-core';
import { AllWidgetProps } from 'jimu-core';
import { Link, Nav, NavItem } from 'jimu-ui';
import { IMConfig } from '../config';
import './css/style.scss';

interface Props {
  pages: Object
}

interface State {
  selectedID: string
}


export default class Widget extends BaseWidget<AllWidgetProps<IMConfig> & Props, State>{
  constructor(props) {
    super(props);
    this.state = {
      selectedID: ''
    }
  }

  static mapExtraStateProps = (state) => {
    return {
      pages: state.appConfig.pages
    }
  };

  componentDidUpdate() {
    const { selectedID } = this.state;
    const pageInfos = this.getPageInfo();
    if (!pageInfos || selectedID) {
      return;
    }
    this.setState({ selectedID: pageInfos[0].id });
  }

  getPageInfo = () => {
    let { pages } = this.props;
    if (!pages) {
      return false;
    }
    let pageInfos = [];
    for (let id in pages) {
      let label = pages[id].label || id;
      pageInfos.push({ id: id, label: label });
    }
    return pageInfos.length ? pageInfos : false;
  }

  handleClick = (evt, pageID) => {
    evt.nativeEvent.stopImmediatePropagation();
    this.setState({ selectedID: pageID });
  }

  render() {
    const { selectedID } = this.state;
    const pageInfos = this.getPageInfo();

    let children;
    if (pageInfos) {
      children = pageInfos.map((item, i) => {
        return <NavItem key={i} onClick={evt => this.handleClick(evt, item.id)} active={selectedID === item.id}>
          <Link to={'?page=' + item.id}>{item.label}</Link>
        </NavItem>
      });
    } else {
      children = <div></div>;
    }

    return <div className="widget-menu">
      <Nav>{children}</Nav>
    </div>
  }
}

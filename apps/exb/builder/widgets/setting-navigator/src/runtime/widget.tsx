import {BaseWidget, AllWidgetProps, React, classNames as classnames, changeView} from 'jimu-core';
import {IMConfig} from '../config';

import './css/style.scss';

interface Props{

}

export default class Widget extends BaseWidget<AllWidgetProps<IMConfig> & Props, any>{

  constructor(props){
    super(props);
  }

  views = {
    general: 'general-setting-view',
    page: 'page-setting-view',
    widget: 'widget-setting-view'
  }

  onMenuClicked = e => {
    const clickedMenuClassName = e.target.className || e.target.parentElement.className;
    const contanierNode = e.currentTarget;
    const view = clickedMenuClassName.indexOf('general-setting') > -1 ? this.views.general
      : clickedMenuClassName.indexOf('page-setting') > -1 ? this.views.page : this.views.widget;

    this.changeClass(clickedMenuClassName, contanierNode);
    this.changeView(view);
  }

  changeClass(c, n){
    const viewNodes = n.children;

    for(let i = 0; i < viewNodes.length; i++){
      // if secleted view
      if(viewNodes[i].className.indexOf(c) > -1){
        viewNodes[i].className = c + ' active-setting';
      }else{
        viewNodes[i].className = viewNodes[i].className.replace(' active-setting', '');
      }
    }
  }

  changeView(v){
    changeView('right-section', v);
  }

  render(){
    const activeView = this.props.queryObject.views || '';
    return (
      <menu className='widget-builder-setting-navigator'>
        <div onClick={this.onMenuClicked}>
          <div className={classnames('general-setting', {'active-setting': activeView.indexOf(this.views.page) < 0 &&
            activeView.indexOf(this.views.widget) < 0})}>
            <span title={this.props.nls.generalSetting}></span>
          </div>
          <div className={classnames('page-setting', {'active-setting': activeView.indexOf(this.views.page) > -1})}>
            <span title={this.props.nls.pageSetting}></span>
          </div>
          <div className={classnames('widget-setting', {'active-setting': activeView.indexOf(this.views.widget) > -1})}>
            <span title={this.props.nls.widgetSetting}></span>
          </div>
        </div>
      </menu>
    );
  }
}

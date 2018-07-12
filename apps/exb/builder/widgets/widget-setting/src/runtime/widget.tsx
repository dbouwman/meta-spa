import * as classnames from 'classnames';

import {BaseWidget, IMWidgetJson, IMState, AllWidgetProps, appConfigUtils, IMRuntimeInfos, React, IMDataSourceJson} from 'jimu-core';
import {Tab, Tabs} from 'jimu-ui';
import {WidgetSettingManager, appStateActions} from 'jimu-for-builder';
import './css/style.scss';

interface Props{
  widgetsSettingRuntimeInfo: IMRuntimeInfos
}
export default class Widget extends BaseWidget<AllWidgetProps<{}> & Props, {}>{
  static mapExtraStateProps = (state: IMState) => {
    return {
      widgetsSettingRuntimeInfo: state.builder.widgetsSettingRuntimeInfo,
    }
  };

  constructor(props){
    super(props);
  }

  componentDidUpdate(){
    let currentWidgetId = Object.keys(this.props.widgetsSettingRuntimeInfo).filter(wId => this.props.widgetsSettingRuntimeInfo[wId].isSetting)[0];
    if(!currentWidgetId){
      return;
    }
    
    !WidgetSettingManager.getInstance().getWidgetSettingClass(currentWidgetId) && WidgetSettingManager.getInstance().loadWidgetSettingClass(currentWidgetId);
  }

  onWidgetConfigChange = (widgetId: string, widgetConfig: any, useDataSources: string[], outputDataSources: IMDataSourceJson[]) => {
    let widgetJson = this.props.appState.appConfig.widgets[widgetId];
    widgetJson = widgetJson.set('config', widgetConfig)
    if(useDataSources){
      widgetJson = widgetJson.set('usedDataSourceIds', useDataSources);
    }
    if(outputDataSources){
      widgetJson = widgetJson.set('outputDataSources', outputDataSources.map(ds => ds.id));
      outputDataSources.forEach(ds => {
        this.props.dispatch(appStateActions.inBuilderEditAppAddDataSource(ds));
      });
    }
    this.props.dispatch(appStateActions.inBuilderEditAppEditWidget(widgetJson));
  }


  renderWidgetSetting = (widgetId: string) => {
    let SettingClass = this.props.widgetsSettingRuntimeInfo[widgetId] && this.props.widgetsSettingRuntimeInfo[widgetId].isClassLoaded?
      WidgetSettingManager.getInstance().getWidgetSettingClass(widgetId): null;
    return SettingClass? <SettingClass onConfigChange={this.onWidgetConfigChange}/>: <div>loading...</div>
  };

  render(){
    if(!this.props.appState || !this.props.appState.appConfig){
      return <div>waiting for app load...</div>;
    }
    let currentWidgetId = Object.keys(this.props.widgetsSettingRuntimeInfo).filter(wId => this.props.widgetsSettingRuntimeInfo[wId].isSetting)[0];
    /* if(!currentWidgetId){
      return <div>No widget</div>;
    } */
    return <div className="setting-pane builder-widget-setting">
        <section className='setting-header'>
          <h5 className='mb-0'>Widget Settings</h5>
          <button className='btn btn-sm btn-link' onClick={this.onToggleMe} >
            <span className='setting-header--icon'></span>
          </button>
        </section>
      {currentWidgetId ? this.renderWidgetSetting(currentWidgetId) : <div>&nbsp;&nbsp;No widget</div>}
    </div>;
  }

  // FOR DEMO:
  onToggleMe = () => {
    let rightToggle = document.getElementsByClassName('sidebar_handler_right');
    if(rightToggle) {
      (rightToggle[0] as HTMLElement).click();
    }
  }
  // TODO: REMOVE AFTER DEMO

}

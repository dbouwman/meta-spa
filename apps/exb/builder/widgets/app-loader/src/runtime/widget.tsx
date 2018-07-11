import * as classnames from 'classnames';

import {BaseWidget, React, IMState, SeamlessImmutable, IMWidgetJson, LayoutInfo, WidgetJson} from 'jimu-core';
import {AllWidgetProps, appConfigUtils, AppMode, WidgetManager} from 'jimu-core';
import {ChooseWidgetPopup, builderActions, builderAppSync, appConfigActions} from 'jimu-for-builder';

import './css/style.scss';

interface ExtraProps{
  showChooseWidgetPopup: boolean;
  currentLayout: LayoutInfo
}

export default class Widget extends BaseWidget<AllWidgetProps<{}> & ExtraProps, any>{
  appIframe: HTMLIFrameElement;
  static mapExtraStateProps = (state: IMState, ownProps?: AllWidgetProps<{}>) => {
    return {
      showChooseWidgetPopup: state.builder.showChooseWidgetPopup,
      currentLayout: state.builder.currentLayout
    }
  };

  onAppLoaded = () => {
  };

  componentDidMount(){
    this.props.dispatch(builderActions.changeCurrentPage('default'));
  }

  onChooseWidget = (widgetUri: string) => {
    let widgetId = appConfigUtils.getUniqueId(this.props.appState.appConfig, 'widget');

    let widgetJson = {
      id: widgetId,
      uri: widgetUri,
      context: appConfigUtils.getWidgetContext(widgetUri)
    } as WidgetJson;

    WidgetManager.getInstance().handleNewWidgetJson(widgetJson).then(widgetJson => {
      let imWidgetJson = SeamlessImmutable(widgetJson) as IMWidgetJson;
      this.props.dispatch(appConfigActions.actions.inBuilderEditAppAddWidget(imWidgetJson, this.props.currentLayout));
      this.props.dispatch(builderActions.closeChooseWidgetPopup());
      builderAppSync.publishAddWidgetToApp(widgetId, this.props.currentLayout);
    });
  }

  render(){
    let appUrl = `../stemapp/index.html`;
    if(this.props.queryObject.app_config){
      appUrl += '?config=' + this.props.queryObject.app_config;
    }
    if(this.props.queryObject.id){
      appUrl += '?id=' + this.props.queryObject.id;
    }

    return <div className="jimu-widget widget-builder-app-loader">
      <iframe name="config-app" src={appUrl} className="config-preview" onLoad={this.onAppLoaded} ref={dom => this.appIframe = dom}></iframe>
      {this.props.showChooseWidgetPopup && <ChooseWidgetPopup onOK={this.onChooseWidget} title='Choose Widget'
        onCancel={() => this.props.dispatch(builderActions.closeChooseWidgetPopup())}></ChooseWidgetPopup>}
    </div>;
  }
}

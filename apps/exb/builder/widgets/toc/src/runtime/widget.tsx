
import {BaseWidget, IMWidgetJson, IMPageJson, IMState, AllWidgetProps, appConfigUtils, IMRuntimeInfos, React, DataSource, SeamlessImmutable, classNames, IMSectionJson, IMViewJson} from 'jimu-core';
import {WidgetSettingManager, builderActions, appConfigActions, builderAppSync} from 'jimu-for-builder';
import { IMLayoutJson, changeView } from 'jimu-core';
import './css/style.scss';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Icon, DropdownProps } from 'jimu-ui';

interface ExtraProps{
  currentPageId: string;
  currentSectionId: string;
  currentViewId: string;
  currentControllerId: string;
}

interface State{
}

export default class Widget extends BaseWidget<AllWidgetProps<{}> & ExtraProps, State>{

  constructor(props){
    super(props);
  }

  static mapExtraStateProps = (state: IMState) => {
    return {
      currentPageId: state.builder.currentPageId,
      currentSectionId: state.builder.currentSectionId,
      currentViewId: state.builder.currentViewId,
    }
  }

  changeCurrentPage = (pageId: string) => {
    this.props.dispatch(builderActions.changeCurrentPage(pageId));
    builderAppSync.publishPageChangeToApp(pageId);
    changeView('right-section', 'page-setting-view');
  }

  removePage = (pageId: string) => {
    if(pageId === 'default'){
      console.error('you can not remove default page');
      return;
    }
    this.props.dispatch(builderActions.changeCurrentPage('default'));
    builderAppSync.publishPageChangeToApp('default');
    this.props.dispatch(appConfigActions.actions.inBuilderEditAppRemovePage(pageId));
  }

  changeCurrentSection = (sectionId: string) => {
    this.props.dispatch(builderActions.changeCurrentSection(sectionId));
  }

  changeCurrentView = (sectionId: string, viewId: string) => {
    this.props.dispatch(builderActions.changeCurrentView(viewId));
    builderAppSync.publishViewChangeToApp(sectionId, viewId);
  }

  addPage = () => {
    let layoutId = appConfigUtils.getUniqueId(this.props.appState.appConfig, 'layout');
    let pageLayout = SeamlessImmutable({}).merge({
      id: layoutId,
      "0": {
        "id": "0",
        "pos": {
          "x": 0,
          "y": 0,
          "w": 100,
          "h": 100
        },
        "type": "fixed",
        "setting": {
          "widthInPixel": false,
          "heightInPixel": false,
          "active": false
        }
      }
    }) as IMLayoutJson;

    let pageJson = SeamlessImmutable({}).merge({
      id: appConfigUtils.getUniqueId(this.props.appState.appConfig, 'page'),
      label: appConfigUtils.getUniqueLabel(this.props.appState.appConfig, 'page'),
      sharedArea: {},
      layout: layoutId,
      widgets: []
    }) as IMPageJson;
    
    this.props.dispatch(appConfigActions.actions.inBuilderEditAppAddPage(pageJson, pageLayout));
  }

  addView = () => {
    let layoutId = appConfigUtils.getUniqueId(this.props.appState.appConfig, 'layout');
    let viewLayout = SeamlessImmutable({}).merge({
      id: layoutId,
      "0": {
        "id": "0",
        "pos": {
          "x": 0,
          "y": 0,
          "w": 100,
          "h": 100
        },
        "type": "fixed",
        "setting": {
          "widthInPixel": false,
          "heightInPixel": false,
          "active": false
        }
      }
    }) as IMLayoutJson;

    let viewJson = SeamlessImmutable({}).merge({
      id: appConfigUtils.getUniqueId(this.props.appState.appConfig, 'view'),
      label: appConfigUtils.getUniqueLabel(this.props.appState.appConfig, 'view'),
      layout: layoutId,
      widgets: []
    }) as IMPageJson;
    
    this.props.dispatch(appConfigActions.actions.inBuilderEditAppAddView(viewJson, this.props.currentSectionId, viewLayout));
  }

  changeCurrentWidget = (widgetId: string) => {
    changeView('right-section', 'widget-setting-view');
    this.props.dispatch(builderActions.changeCurrentWidget(widgetId));
    builderAppSync.publishCurrentSettingWidgetChangeToApp(widgetId);
  }

  removeWidget = (widgetId: string) => {
    WidgetSettingManager.getInstance().deleteWidgetClass(widgetId);
    this.props.dispatch(builderActions.widgetRemoved(widgetId));
    builderAppSync.publishRemoveWidgetToApp(widgetId);

    //TODO do not use timeout
    //Because buider-app-sync is async, so we need timeout here
    setTimeout(() => {
      this.props.dispatch(appConfigActions.actions.inBuilderEditAppRemoveWidget(widgetId));
    }, 50);
  }

  removeSection = (sectionId: string) => {
    builderAppSync.publishRemoveSectionToApp(sectionId);

    setTimeout(() => {
      this.props.dispatch(appConfigActions.actions.inBuilderEditAppRemoveSection(sectionId));
    }, 50);
  }

  removeView = (viewId: string) => {
    this.props.dispatch(appConfigActions.actions.inBuilderEditAppRemoveView(viewId, this.props.currentSectionId));
    this.changeCurrentView(this.props.currentSectionId, null);
  }

  onSectionBackClick = () => {
    this.changeCurrentView(this.props.currentSectionId, null);
    this.changeCurrentSection(null);
  }

  render(){
    if(!this.props.appState || !this.props.appState.appConfig){
      return <div>waiting for app load...</div>;
    }

    let appConfig = this.props.appState.appConfig;
    let {currentPageId, currentSectionId} = this.props;
    const {WidgetAndSectionList, PageItem, Viewtem} = this;

    return <div className="widget-builder-toc">
      <div className={classNames({'app-view': true, hide: !!currentSectionId})}>
        <div className="page-block block">
          <div className="block-title page-title">
            <h5 className="mb-0">Pages</h5>
            <button type="button" className='btn btn-sm btn-link' onClick={this.addPage}><Icon icon="plus"></Icon></button>
          </div>
          <div className="block-list page-list">
            {Object.keys(appConfig.pages).map(pId => {
              let page = appConfig.pages[pId];
              return <PageItem key={pId} pageJson={page}></PageItem>;
            })}
          </div>
        </div>

        <hr/>

        <div className="page-content content">
          <div className="page-content-title content-title">
            <h6 className="text-secondary mb-0">Page contents</h6>
          </div>
          <WidgetAndSectionList appConfig={appConfig} containerType="pages" containerId={currentPageId}></WidgetAndSectionList>
        </div>

        <div className="data-block block">
          <h5 className="mb-0">Data</h5>
          <div className="data-list block-list">
            {appConfig.dataSources && Object.keys(appConfig.dataSources).map(dsId => {
              let dataSource = appConfig.dataSources[dsId];
              return <div key={dsId} className="data-item">{dataSource.label}</div>;
            })}
          </div>
        </div>
      </div>

      <div className={classNames({'section-view': true, hide: !currentSectionId})}>
        <div className="view-block block">
          <div className="view-block-title block-title">
            <div className="btn-back btn btn-link btn-sm" onClick={this.onSectionBackClick}>
              <Icon icon="left"></Icon>
            </div>
            <h5 className="mb-0">Views</h5>
            <button type="button" className='btn btn-sm btn-link' onClick={this.addView}><Icon icon="plus"></Icon></button>
          </div>
          
          <div className="view-list block-list">
            {currentSectionId && appConfig.sections[currentSectionId].views && appConfig.sections[currentSectionId].views.map(vId => {
              let view = appConfig.views[vId];
              return <Viewtem key={vId} currentSectionId={currentSectionId} viewJson={view}></Viewtem>
            })}
          </div>
        </div>

        <hr/>
        
        <div className="view-content content">
          <div className="view-content-title content-title">
            <h6 className="mb-0">View contents</h6>
          </div>
          {
            this.props.currentViewId && <WidgetAndSectionList appConfig={appConfig} containerType="views" containerId={this.props.currentViewId}></WidgetAndSectionList>
          }
        </div>
        
      </div>
      
    </div>;
  }

  WidgetAndSectionList = ({appConfig, containerType, containerId}) => {
    const {WidgetItem, Sectiontem} = this;
    let widgets = appConfig[containerType][containerId].widgets || [];

    if(containerType === 'pages'){
      if(appConfig[containerType][containerId].sharedArea){
        Object.keys(appConfig[containerType][containerId].sharedArea).forEach(areaId => {
          let area = appConfig[containerType][containerId].sharedArea[areaId];
          if(area){
            widgets = widgets.concat(appConfig.sharedArea[areaId] && appConfig.sharedArea[areaId].widgets || []);
          }
        });
      }
    }
    return <>
      <div className="widget-list">
        {
          widgets.map(wId => {
            let widget = appConfig.widgets[wId];
            return <WidgetItem key={widget.id} widgetJson={widget}></WidgetItem>
          })
        }
      </div>
  
      <div className="section-list">
        {
          appConfig[containerType][containerId].sections && appConfig[containerType][containerId].sections.map(sId => {
            let section = appConfig.sections[sId];
            return <Sectiontem key={section.id} sectionJson={section}></Sectiontem>
          })
        }
      </div>
    </>;
  }

  PageItem = ({pageJson}: {pageJson: IMPageJson}) => {
    return <div className="page-item item" onClick={evt => this.changeCurrentPage(pageJson.id)}>
      {this.props.currentPageId === pageJson.id && <div className="current-indicator"></div>}
      <Icon size={12} icon="organization"></Icon>
      <div className="item-label">{pageJson.label}</div>
      <MyDropDown removeClick={() => this.removePage(pageJson.id)}></MyDropDown>
    </div>
  }
  
  WidgetItem = ({widgetJson}: {widgetJson: IMWidgetJson}) => {
    return <div key={widgetJson.id} className="widget-item item" onClick={evt => this.changeCurrentWidget(widgetJson.id)}
      onMouseEnter={() => builderAppSync.publishToggleWidgetHighlightToApp(widgetJson.id, true)}
      onMouseLeave={() => builderAppSync.publishToggleWidgetHighlightToApp(widgetJson.id, false)}>
      <img src={`${widgetJson.icon}`} width="12" height="12"/>
      <div className="item-label">{widgetJson.label}</div>
      <MyDropDown removeClick={() => this.removeWidget(widgetJson.id)}></MyDropDown>
    </div>
  }
  
  Sectiontem = ({sectionJson}: {sectionJson: IMSectionJson}) => {
    return <div key={sectionJson.id} className="section-item item" onDoubleClick={evt => this.changeCurrentSection(sectionJson.id)}>
      <Icon size={12} icon="dock-bottom"></Icon>
      <div className="item-label">{sectionJson.id}</div>
      <MyDropDown removeClick={() => this.removeSection(sectionJson.id)}></MyDropDown>
    </div>
  }

  Viewtem = ({currentSectionId, viewJson}: {currentSectionId: string, viewJson: IMViewJson}) => {
    return <div key={viewJson.id} className="view-item item" onClick={evt => this.changeCurrentView(currentSectionId, viewJson.id)}>
      {this.props.currentViewId === viewJson.id && <div className="current-indicator"></div>}
      <Icon size={12} icon="dock-bottom"></Icon>
      <div className="item-label">{viewJson.id}</div>
      <MyDropDown removeClick={() => this.removeView(viewJson.id)}></MyDropDown>
    </div>
  }
}

class MyDropDown extends React.PureComponent<{removeClick: () => void}, {isOpen: boolean}>{
  constructor(props){
    super(props);
    this.state = {isOpen: false}
  }

  render(){
    return <div className="my-dropdown">
      <Dropdown size="sm" isOpen={this.state.isOpen} onClick={evt => evt.stopPropagation()} toggle={() => this.setState({isOpen: !this.state.isOpen})}>
        <DropdownToggle color="link">
          <Icon icon="handle-horizontal"></Icon>
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={this.props.removeClick}>Remove</DropdownItem>
          <DropdownItem>Rename</DropdownItem>
          <DropdownItem>Duplicate</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>;
  }
}

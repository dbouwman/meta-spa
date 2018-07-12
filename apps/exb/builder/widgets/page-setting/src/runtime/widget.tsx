import {BaseWidget, AllWidgetProps, React, SeamlessImmutable, IMPageJson, IMState, appConfigUtils} from 'jimu-core';
import {IMConfig} from '../config';
import {Input, InputGroup} from 'jimu-ui';
import {appConfigActions, builderAppSync} from 'jimu-for-builder';
import SettingCollapse from './components/page-setting-collapse';
import ColorPicker from 'jimu-ui/lib/components/color-picker';

import './css/style.scss';

interface Props{
  pageId: string;
}
interface State{
  isCustomWidthOpened: boolean;
}

export default class Widget extends BaseWidget<AllWidgetProps<IMConfig> & Props, State>{

  constructor(props){
    super(props);
    this.state = {
      isCustomWidthOpened: false,
    }
  }

  static mapExtraStateProps = (state: IMState) => {
    return {
      pageId: state.builder.currentPageId
    }
  }

  onNameChange = e => {
    const name = e.currentTarget.value;
    const previousPageJson = this.props.appState.appConfig.pages[this.props.pageId];
    let pageJson = SeamlessImmutable(previousPageJson).merge({
      label: name
    }) as IMPageJson;
    this.props.dispatch(appConfigActions.actions.inBuilderEditAppEditPage(pageJson));
  }

  getPageWidthMode = (): ('fit' | 'px') => {
    if(!this.props.appState || !this.props.appState.appConfig){
      return 'fit';
    }
    let layoutItem = this.props.appState.appConfig.layouts[this.getAppLayoutId()][this.getAppRootLayoutItemId()];
    if(layoutItem.setting && layoutItem.setting.widthInPixel === false){
      return 'fit';
    }

    return 'px';
  }

  getPageWidth = (): number => {
    if(!this.props.appState || !this.props.appState.appConfig){
      return 0;
    }
    let layoutItem = this.props.appState.appConfig.layouts[this.getAppLayoutId()][this.getAppRootLayoutItemId()];

    return layoutItem.pos.w || 0;
  }

  getPageBackground = () => {
    let defaultColor = '#eee'
    if(!this.props.appState || !this.props.appState.appConfig){
      return defaultColor;
    }

    if(!this.props.pageId){
      return false;
    }

    let layoutItem = this.props.appState.appConfig.layouts[this.getPageBodyLayoutId(this.props.pageId)][this.getPageBodyRootLayoutItemId(this.props.pageId)];
    return layoutItem.setting && layoutItem.setting.style? layoutItem.setting.style.background: defaultColor;
  }

  getHeaderBackground = () => {
    let defaultColor = '#eee'
    if(!this.props.appState || !this.props.appState.appConfig){
      return defaultColor;
    }

    if(!this.props.pageId){
      return false;
    }

    let layoutItem = this.props.appState.appConfig.layouts[this.getAppLayoutId()][this.getAreaLayoutItemId('header')];
    return layoutItem.setting && layoutItem.setting.style? layoutItem.setting.style.background: defaultColor;
  }

  getAreaVisible = (area: string): boolean => {
    if(!this.props.appState || !this.props.appState.appConfig){
      return false;
    }

    if(!this.props.pageId){
      return false;
    }

    if(!this.props.appState.appConfig.pages[this.props.pageId].sharedArea){
      return false;
    }
    return this.props.appState.appConfig.pages[this.props.pageId].sharedArea[area] || false;
  }

  getAreaSize = (area: string): number => {
    if(!this.props.appState || !this.props.appState.appConfig){
      return 0;
    }

    let layout = this.props.appState.appConfig.layouts[this.getAppLayoutId()];
    let layoutItem = layout[this.getAreaLayoutItemId(area)];
    return layoutItem && layoutItem.pos[this.getAreaLayoutPosKey(area)] || 0;
  }

  getAreaSettingValue = (area: string, p: string): boolean => {
    if(!this.props.appState || !this.props.appState.appConfig){
      return false;
    }

    let layout = this.props.appState.appConfig.layouts[this.getAppLayoutId()];
    let layoutItem = layout[this.getAreaLayoutItemId(area)];
    return layoutItem && layoutItem.setting && layoutItem.setting[p] || false;
  }

  onSelectFitToWidth = () => {
    builderAppSync.publishUpdateLayoutItemToApp({
      layoutId: '__app_layout',
      layoutItemId: '0'
    }, {
      pos: {w: 100},
      setting: {widthInPixel: false}
    });
  }

  onSelectCustomWidth = () => {
    let w = this.getPageWidthMode() === 'fit'? 1000: undefined;

    builderAppSync.publishUpdateLayoutItemToApp({
      layoutId: this.getAppLayoutId(),
      layoutItemId: this.getAppRootLayoutItemId()
    }, {
      pos: {w: w},
      setting: {widthInPixel: true}
    });
  }

  onCustomWidthChange = (width: number) => {
    builderAppSync.publishUpdateLayoutItemToApp({
      layoutId: this.getAppLayoutId(),
      layoutItemId: this.getAppRootLayoutItemId()
    }, {
      pos: {w: width},
    });
  }

  onSharedAreaVisibleChange = (area: string, visible: boolean) => {
    let pageJson = this.props.appState.appConfig.pages[this.props.pageId];

    pageJson = pageJson.setIn(['sharedArea', area], visible);
    this.props.dispatch(appConfigActions.actions.inBuilderEditAppEditPage(pageJson));
  }

  onSharedAreaSizeChange = (area: string, size: string) => {
    builderAppSync.publishUpdateLayoutItemToApp({
      layoutId: this.getAppLayoutId(),
      layoutItemId: this.getAreaLayoutItemId(area)
    }, {
      pos: {[this.getAreaLayoutPosKey(area)]: parseInt(size)},
    });
  }

  onSharedAreaSettingChange = (area: string, key: string, value: any) => {
    builderAppSync.publishUpdateLayoutItemToApp({
      layoutId: this.getAppLayoutId(),
      layoutItemId: this.getAreaLayoutItemId(area)
    }, {
      setting: {[key]: value}
    });
  }

  onPageBackgroundChange = (color: string) => {
    builderAppSync.publishUpdateLayoutItemToApp({
      layoutId: this.getPageBodyLayoutId(this.props.pageId),
      layoutItemId: this.getPageBodyRootLayoutItemId(this.props.pageId)
    }, {
      setting: {style: {background: color}}
    });
  }

  onHeaderBackgroundChange = (color: string) => {
    builderAppSync.publishUpdateLayoutItemToApp({
      layoutId: this.getAppLayoutId(),
      layoutItemId: this.getAreaLayoutItemId('header')
    }, {
      setting: {style: {background: color}}
    });
  }

  getAppLayoutId(): string{
    return this.props.appState.appConfig.sharedArea.layout;
  }

  getAppRootLayoutItemId(): string{
    let layout = this.props.appState.appConfig.layouts[this.getAppLayoutId()];
    return Object.keys(layout).filter(itemId => !layout[itemId].parentId)[0];
  }

  getPageBodyLayoutId(pageId: string): string{
    return this.props.appState.appConfig.pages[pageId].layout;
  }

  getPageBodyRootLayoutItemId(pageId: string): string{
    let layout = this.props.appState.appConfig.layouts[this.getPageBodyLayoutId(pageId)];
    return Object.keys(layout).filter(itemId => !layout[itemId].parentId)[0];
  }

  getAreaLayoutItemId(area: string): string{
    let layout = this.props.appState.appConfig.layouts[this.getAppLayoutId()];
    return Object.keys(layout).filter(itemId => {
      if(area === 'header'){
        return layout[itemId].setting && layout[itemId].setting.attach === 'top';
      }
      if(area === 'footer'){
        return layout[itemId].setting && layout[itemId].setting.attach === 'bottom';
      }
      if(area === 'leftArea'){
        return layout[itemId].setting && layout[itemId].setting.attach === 'left';
      }
      if(area === 'rightArea'){
        return layout[itemId].setting && layout[itemId].setting.attach === 'right';
      }
    })[0];
  }

  getAreaLayoutPosKey(area: string): string{
    if(area === 'header' || area === 'footer'){
      return 'h';
    }
    return 'w';
  }

  render(){
    const currentPageName = this.props.appState && this.props.appState.appConfig && this.props.appState.appConfig.pages[this.props.pageId].label || '';
    return (
      <div className='setting-pane widget-builder-page-setting'>
        <section className='setting-header'>
          <h5 className='mb-0'>Page Settings</h5>
          <button className='btn btn-sm btn-link' onClick={this.onToggleMe} >
            <span className='setting-header--icon'></span>
          </button>
        </section>
        <section className='page-setting-name'>
          <label htmlFor='page-name'>Name</label>
          <Input id='page-name' type='text' onChange={this.onNameChange}
            value={currentPageName}/>
        </section>
        <section className='page-setting-display-mode'>
          <div className='page-setting-display-mode-title'>Display mode</div>
          <InputGroup className='page-setting-display-mode-group'>
            <div>
              <Input type='radio' id='fit-to-width' name='display-mode' checked={this.getPageWidthMode() === 'fit'}
                onChange={({target: {checked}}) => {
                  this.setState({isCustomWidthOpened: !checked});
                  checked && this.onSelectFitToWidth();
                }}/>
              <label htmlFor='fit-to-width'>Fit to width</label>
            </div>
            <div>
              <Input type='radio' id='custom-width' name='display-mode' checked={this.getPageWidthMode() === 'px'}
                onChange={({target: {checked}}) => {
                  this.setState({isCustomWidthOpened: checked});
                  checked && this.onSelectCustomWidth();
                }}/>
              <label htmlFor='custom-width'>Custom width</label>
            </div>
          </InputGroup>
          <SettingCollapse size={this.getPageWidth()} onVisibleChange={() => {}} widthOption={{onChange: (width) => this.onCustomWidthChange(width), label: 'custom-width'}} isOpen={this.state.isCustomWidthOpened}/>
        </section>
        <section className="page-background">
          <label><strong>Background</strong></label>
          <ColorPicker id="color-1" color={this.getPageBackground()} onChange={(color) => this.onPageBackgroundChange(color.hex)}></ColorPicker>
        </section>
        <section className='page-setting-layout-sections'>
          <SettingCollapse size={this.getAreaSize('header')} isOpen={this.getAreaVisible('header')} onVisibleChange={(checked) => this.onSharedAreaVisibleChange('header', checked)} title='Header' heightOption={{onChange: h => this.onSharedAreaSizeChange('header', h), label: 'header-height'}}
            backgroundOption={{onChange: this.onHeaderBackgroundChange, label: 'header-background'}} background={this.getHeaderBackground()}/>
          <SettingCollapse size={this.getAreaSize('footer')} isOpen={this.getAreaVisible('footer')} onVisibleChange={(checked) => this.onSharedAreaVisibleChange('footer', checked)} title='Footer' heightOption={{onChange: h => this.onSharedAreaSizeChange('footer', h), label: 'footer-height'}}/>
          <SettingCollapse size={this.getAreaSize('leftArea')} 
            togglable={this.getAreaSettingValue('leftArea', 'togglable') as boolean}
            resizable={this.getAreaSettingValue('leftArea', 'resizable') as boolean}
            isOpen={this.getAreaVisible('leftArea')}
            onVisibleChange={(checked) => this.onSharedAreaVisibleChange('leftArea', checked)} title='Left side panel'
            widthOption={{onChange: w => this.onSharedAreaSizeChange('leftArea', w), label: 'left-width'}}
            collapsibleOption={{onChange: (checked) => this.onSharedAreaSettingChange('leftArea', 'togglable', checked), label: 'left-collapse'}}
            resizeableOption={{onChange: (checked) => this.onSharedAreaSettingChange('leftArea', 'resizable', checked), label: 'left-resize'}}/>
          <SettingCollapse size={this.getAreaSize('rightArea')}
            isOpen={this.getAreaVisible('rightArea')} 
            onVisibleChange={(checked) => this.onSharedAreaVisibleChange('rightArea', checked)} 
            togglable={this.getAreaSettingValue('rightArea', 'togglable') as boolean}
            resizable={this.getAreaSettingValue('rightArea', 'resizable') as boolean}
            title='Right side panel' 
            widthOption={{onChange: w => this.onSharedAreaSizeChange('rightArea', w), label: 'right-width'}}
            collapsibleOption={{onChange: (checked) => this.onSharedAreaSettingChange('rightArea', 'togglable', checked), label: 'right-collapse'}}
            resizeableOption={{onChange: (checked) => this.onSharedAreaSettingChange('rightArea', 'resizable', checked), label: 'right-resize'}}/>
        </section>
      </div>
    );
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

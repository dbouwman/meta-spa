import {BaseWidget, AllWidgetProps, React, IMState, IMAttributesJson, classNames, SeamlessImmutable} from 'jimu-core';
import {IMConfig} from '../config';
import {Input} from 'jimu-ui';
import {appConfigActions} from 'jimu-for-builder';
import ColorPicker from './components/general-setting-color-picker';

import './css/style.scss';
import { Attributes } from 'react';

interface Props{

}

interface State{
  selectedSkin: string;
}

interface AppAttributesType{
  title?: string;
  subTitle?: string;
  logo?: string;
}

interface SkinItemType{
  name: string;
  mainColor: string;
}

export default class Widget extends BaseWidget<AllWidgetProps<IMConfig> & Props, State>{

  constructor(props){
    super(props);
    this.state = {
      selectedSkin: ''
    }
  }

  skinListInfo: SkinItemType[] = this.getSkinListInfo()

  componentDidUpdate() {
    if(this.props.appState && this.props.appState.appConfig && !this.state.selectedSkin){
      this.setState({selectedSkin: this.props.appState.appConfig.skin});
    }
  }

  getSkinListInfo(): SkinItemType[]{
    let listInfo = require('../../../../../skins/skins-info.json');
    return listInfo.concat([{name: 'custom', mainColor: '#ffffff'}]);
  }

  onGeneralColorChange = (color, id) => {
    //TODO: 1. how to save color  2. handle color change
    document.getElementById(id).style.background = color;
  }

  changeAppAttributes(a: AppAttributesType){
    const previousAttributesJson = this.props.appState.appConfig.attributes;
    let attributesJson = SeamlessImmutable(previousAttributesJson).merge(a) as IMAttributesJson;
    this.props.dispatch(appConfigActions.actions.InBuilderEditAppEditAttributes(attributesJson));
  }

  onAppTitleChange = e => {
    this.changeAppAttributes({title: e.currentTarget.value});
  }

  onAppSubTitleChange = e => {
    this.changeAppAttributes({subTitle: e.currentTarget.value});
  }

  onSkinChange = (s: SkinItemType) => {
    this.setState({selectedSkin: s.name});
    if(s.name === 'custom'){
      return;
    }
    this.props.dispatch(appConfigActions.actions.InBuilderEditAppEditSkin(s.name));
  }

  getListItemJSX = (s: SkinItemType) => {
    // TODO: Custom color
    return <span className={classNames('general-setting-skin-item',
            {'general-setting-skin-selected': this.state.selectedSkin === s.name},
            {'general-setting-skin-custom': s.name === 'custom'})}
            style={{'backgroundColor': s.mainColor}} key={s.name}
            onClick={() => {this.onSkinChange(s)}}>{s.name === 'custom' ? 'Custom' : ''}</span>
  }

  getAppAttributes(): AppAttributesType{
    return {
      logo: this.props.appState && this.props.appState.appConfig && this.props.appState.appConfig.attributes.logo || '../stemapp/assets/img/Logo2.png',
      title: this.props.appState && this.props.appState.appConfig && this.props.appState.appConfig.attributes.title || 'App Name',
      subTitle: this.props.appState && this.props.appState.appConfig && this.props.appState.appConfig.attributes.subTitle || 'With ExB for ArcGis'
    };
  }

  headerColoPickerOptions = {
    textOption:{
      label: 'header-text',
      color:'#000000',
      onColorChange: this.onGeneralColorChange,
      id: 'general-setting-header-text'
    },
    backgroundOption:{
      label: 'header-background',
      color:'#eeeeee',
      onColorChange: this.onGeneralColorChange,
      id: 'general-setting-header-background'
    }
  }

  bodyColorPickerOptions = {
    textOption:{
      label: 'body-text',
      color:'#000000',
      onColorChange: this.onGeneralColorChange,
      id: 'general-setting-body-text'
    },
    backgroundOption:{
      label: 'header-background',
      color:'#eeeeee',
      onColorChange: this.onGeneralColorChange,
      id: 'general-setting-body-background'
    },
    linkOption:{
      label: 'header-link',
      color:'#0075D0',
      onColorChange: this.onGeneralColorChange,
      id: 'general-setting-body-link'
    }
  }

  buttonColorPickerOptions = {
    textOption:{
      label: 'button-text',
      color:'#000000',
      onColorChange: this.onGeneralColorChange,
      id: 'general-setting-button-text'
    },
    backgroundOption:{
      label: 'button-background',
      color:'#eeeeee',
      onColorChange: this.onGeneralColorChange,
      id: 'general-setting-button-background'
    }
  }

  render(){
    return (
      <div className='setting-pane widget-builder-general-setting'>
        <section className='setting-header'>
          <h5 className='mb-0'>General Settings</h5>
          <button className='btn btn-sm btn-link' onClick={this.onToggleMe} >
            <span className='setting-header--icon'></span>
          </button>
        </section>
        <section className='general-setting-brand'>
          <p>Branding</p>
          <p>Add logo, title, or subtitle for your app.</p>
          <div className='clearfix'>
            <div className='general-setting-brand-logo float-left'>
              <img src={this.getAppAttributes().logo || ''} />
            </div>
            <Input type='text' onChange={this.onAppTitleChange} placeholder={this.getAppAttributes().title || ''} className='float-right'/>
            <Input type='text' onChange={this.onAppSubTitleChange} placeholder={this.getAppAttributes().subTitle || ''} className='float-right' />
          </div>
        </section>
        <section className='general-setting-skin'>
          <p>Skin</p>
          <div>
            {this.skinListInfo.map(s => this.getListItemJSX(s))}
          </div>
        </section>
        <section className='general-setting-color'>
          <ColorPicker title='Header' {...this.headerColoPickerOptions}/>
          <ColorPicker title='Body' {...this.bodyColorPickerOptions}/>
          <ColorPicker title='Button' {...this.buttonColorPickerOptions}/>
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

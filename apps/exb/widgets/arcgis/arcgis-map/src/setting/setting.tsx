import {React, SeamlessImmutable, IMDataSourceJson} from 'jimu-core';
import {FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter, Button, Switch} from 'jimu-ui';
import {BaseWidgetSetting, AllWidgetSettingProps, ItemChooser} from 'jimu-for-builder';
import {IMConfig} from '../config';
import './css/style.scss';
import {IItem} from '@esri/arcgis-rest-common-types';
import { DataSourceTypes } from 'jimu-arcgis';

interface State{
  showDialog: boolean
  webmap: IItem;
}
export default class Setting extends BaseWidgetSetting<AllWidgetSettingProps<IMConfig>, State>{
  webmap: IItem;
  portalUrl = 'https://www.arcgis.com';

  constructor(props){
    super(props);

    this.state = {showDialog: false, webmap: null};
  }
  onExtentChange = (evt: React.FormEvent<HTMLInputElement>) => {
    this.props.onConfigChange(this.props.id, this.props.config.set('extent', JSON.parse(evt.currentTarget.value)), null, this.getOutputDs());
  };

  onCanXCheckBoxChange = (checked, name) => {
    this.props.onConfigChange(this.props.id, this.props.config.set(name, checked), null, this.getOutputDs());
  };

  onWebmapSelect = (webmap: IItem) => {
    this.webmap = webmap;
  }

  getOutputDs = (): IMDataSourceJson[] => {
    if(!this.webmap){
      return null;
    }
    let dsJson = SeamlessImmutable({
      id: `${this.webmap.id}-view`,
      label: this.webmap.title,
      type: DataSourceTypes.MapView,
      itemId: this.webmap.id,
    }) as IMDataSourceJson;
    return [dsJson];
  }

  onDataSourceSelectOk = () => {
    this.setState({showDialog: false, webmap: this.webmap});

    this.props.onConfigChange(this.props.id, this.props.config.set('webmapId', this.webmap.id), null, this.getOutputDs());
  }
  onDataSourceSelectCancel = () => {
    this.setState({showDialog: false});
  }

  render(){
    const thumbnail = this.state.webmap ? `${this.portalUrl}/sharing/rest/content/items/${this.state.webmap.id}/info/${this.state.webmap.thumbnail}` :
                      '../widgets/arcgis/arcgis-map/dist/setting/assets/WebMapThumbnail.png';
    return <div className='widget-setting-map'>
      <div className="webmap-thumbnail">
        {
         <div style={{backgroundImage: `url(${thumbnail})`, backgroundSize: 'cover'}}></div>
        }
      </div>

      <Button className="choose-btn" onClick={() => this.setState({showDialog: true})}>Choose Map</Button>

      {
        this.state.webmap &&

        <div className="webmap-info">
          <div><strong>{this.state.webmap.title}</strong></div>
          <div>Owner: {this.state.webmap.owner}</div>
        </div>
      }

      <div className='webmap-tools'>
        <h5>Tools:</h5>
        <div className='can-x-itme'>
          <label>Zoom in/out</label>
          <Switch className='can-x-switch' checked={(this.props.config && this.props.config.canZoom) || false} data-key='canZoom'
          onChange={checked => {this.onCanXCheckBoxChange(checked, 'canZoom')}} />
        </div>
        <div className='can-x-itme'>
          <label>Scale</label>
          <Switch className='can-x-switch' checked={(this.props.config && this.props.config.canScale) || false} data-key='canScale'
          onChange={checked => {this.onCanXCheckBoxChange(checked, 'canScale')}} />
        </div>
        <div className='can-x-itme'>
          <label>Home</label>
          <Switch className='can-x-switch' checked={(this.props.config && this.props.config.canGoHome) || false} data-key='canGoHome'
          onChange={checked => {this.onCanXCheckBoxChange(checked, 'canGoHome')}} />
        </div>
        <div className='can-x-itme'>
          <label>Overview</label>
          <Switch className='can-x-switch' checked={(this.props.config && this.props.config.canOverviewMap) || false} data-key='canOverviewMap'
          onChange={checked => {this.onCanXCheckBoxChange(checked, 'canOverviewMap')}} />
        </div>
        <div className='can-x-itme'>
          <label>Locate</label>
          <Switch className='can-x-switch' checked={(this.props.config && this.props.config.canLocate) || false} data-key='canLocate'
          onChange={checked => {this.onCanXCheckBoxChange(checked, 'canLocate')}} />
        </div>
      </div>

      <Modal contentClassName="item-chooser-popup"
      isOpen={this.state.showDialog}
      toggle={() => this.setState({showDialog: !this.state.showDialog})}>
        <ModalHeader>Choose ds</ModalHeader>
        <ModalBody>
          <ItemChooser itemType="Web Map" portalUrl={'https://www.arcgis.com'} onSelect={this.onWebmapSelect}></ItemChooser>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.onDataSourceSelectOk}>OK</Button>{' '}
          <Button color="secondary" outline onClick={this.onDataSourceSelectCancel}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  }
}
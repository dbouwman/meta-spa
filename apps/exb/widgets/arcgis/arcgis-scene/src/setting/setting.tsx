import {React, IMDataSourceJson, SeamlessImmutable} from 'jimu-core';
import {FormGroup, Label, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, Switch} from 'jimu-ui';
import {BaseWidgetSetting, AllWidgetSettingProps, ItemChooser} from 'jimu-for-builder';
import {IMConfig} from '../config';
import './css/style.scss';
import { IItem } from '@esri/arcgis-rest-common-types';
import { DataSourceTypes } from 'jimu-arcgis';
import { getItem } from '@esri/arcgis-rest-items';

interface State{
  showDialog: boolean
  webscene: IItem;
}
export default class Setting extends BaseWidgetSetting<AllWidgetSettingProps<IMConfig>, State>{
  webscene: IItem;
  portalUrl = 'https://www.arcgis.com';

  constructor(props){
    super(props);

    this.state = {showDialog: false, webscene: null};
  }

  componentDidMount(){
    if(!this.props.config.websceneId){
      return;
    }

    getItem(this.props.config.websceneId).then(item => {
      this.setState({webscene: item});
    })
  }

  onExtentChange = (evt: React.FormEvent<HTMLInputElement>) => {
    this.props.onConfigChange(this.props.id, this.props.config.set('extent', JSON.parse(evt.currentTarget.value)));
  };

  onCanXCheckBoxChange = (checked, name) => {
    this.props.onConfigChange(this.props.id, this.props.config.set(name, checked));
  };

  getOutputDs = (): IMDataSourceJson[] => {
    if(!this.webscene){
      return null;
    }
    let dsJson = SeamlessImmutable({
      id: `${this.webscene.id}-view`,
      label: this.webscene.title,
      type: DataSourceTypes.SceneView,
      itemId: this.webscene.id,
    }) as IMDataSourceJson;
    return [dsJson];
  }

  onWebsceneSelect = (webscene: IItem) => {
    this.webscene = webscene;
  }

  onDataSourceSelectOk = () => {
    this.setState({showDialog: false, webscene: this.webscene});

    this.props.onConfigChange(this.props.id, this.props.config.set('websceneId', this.webscene.id), null, this.getOutputDs());
  }
  onDataSourceSelectCancel = () => {
    this.setState({showDialog: false});
  }

  render(){
    const thumbnail = this.state.webscene ? `${this.portalUrl}/sharing/rest/content/items/${this.state.webscene.id}/info/${this.state.webscene.thumbnail}` :
                      '../widgets/arcgis/arcgis-scene/dist/setting/assets/WebSceneThumbnail.png';
    return <div className='widget-setting-scene'>
      <div className="webscene-thumbnail">
        {
         <div style={{backgroundImage: `url(${thumbnail})`, backgroundSize: 'cover'}}></div>
        }
      </div>

      <Button className="choose-btn" onClick={() => this.setState({showDialog: true})}>Choose Scene</Button>

      {
        this.state.webscene &&

        <div className="webscene-info">
          <div><strong>{this.state.webscene.title}</strong></div>
          <div>Owner: {this.state.webscene.owner}</div>
        </div>
      }
      <div className='webscene-tools'>
        <h5>Tools:</h5>
        <div className='can-x-itme'>
          <label>Zoom in/out</label>
          <Switch className='can-x-switch' checked={(this.props.config && this.props.config.canZoom) || false} data-key='canZoom'
          onChange={checked => {this.onCanXCheckBoxChange(checked, 'canZoom')}} />
        </div>
        <div className='can-x-itme'>
          <label>Navigator</label>
          <Switch className='can-x-switch' checked={(this.props.config && this.props.config.canNavigate) || false} data-key='canNavigate'
          onChange={checked => {this.onCanXCheckBoxChange(checked, 'canNavigate')}} />
        </div>
        <div className='can-x-itme'>
          <label>Home</label>
          <Switch className='can-x-switch' checked={(this.props.config && this.props.config.canGoHome) || false} data-key='canGoHome'
          onChange={checked => {this.onCanXCheckBoxChange(checked, 'canGoHome')}} />
        </div>
        <div className='can-x-itme'>
          <label>Compass</label>
          <Switch className='can-x-switch' checked={(this.props.config && this.props.config.canCompass) || false} data-key='canCompass'
          onChange={checked => {this.onCanXCheckBoxChange(checked, 'canCompass')}} />
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
          <ItemChooser itemType="Web Scene" portalUrl={this.portalUrl} onSelect={this.onWebsceneSelect} ></ItemChooser>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.onDataSourceSelectOk}>OK</Button>{' '}
          <Button color="secondary" outline onClick={this.onDataSourceSelectCancel} >Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  }
}
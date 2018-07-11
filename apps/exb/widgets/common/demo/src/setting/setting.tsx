import {React} from 'jimu-core';
import {BaseWidgetSetting, AllWidgetSettingProps} from 'jimu-for-builder';
import {IMConfig} from '../config';

export default class Setting extends BaseWidgetSetting<AllWidgetSettingProps<IMConfig>, any>{
  onP1Change = (evt: React.FormEvent<HTMLInputElement>) => {
    this.props.onConfigChange(this.props.id, this.props.config.set('p1', evt.currentTarget.value));
  }

  onP2Change = (evt: React.FormEvent<HTMLInputElement>) => {
    this.props.onConfigChange(this.props.id, this.props.config.set('p2', evt.currentTarget.value));
  }

  render(){
    return <div>
      <div>p1: <input defaultValue={this.props.config.p1} onChange={this.onP1Change}/></div>
      <div>p2: <input defaultValue={this.props.config.p2} onChange={this.onP2Change}/></div>
    </div>
  }
}
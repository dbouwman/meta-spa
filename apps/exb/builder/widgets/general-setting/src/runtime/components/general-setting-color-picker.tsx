import {BaseWidget, AllWidgetProps, React} from 'jimu-core';
import {Input} from 'jimu-ui';
import ColorPicker from 'jimu-ui/lib/components/color-picker';

type onChangeType = (e, l: string) => void;

interface OptionType{
  onColorChange: onChangeType;
  label: string;
  id: string;
  color?: string;
}
interface Props{
  title: string;
  textOption?: OptionType;
  backgroundOption?: OptionType;
  linkOption?: OptionType;
}

interface State{

}

export default class Widget extends React.PureComponent<Props, State>{

  constructor(props){
    super(props);
  }

  render(){
    return (
      <div className='widget-builder-component-general-setting-color-picker'>
        <p>{this.props.title}</p>

        {this.props.textOption ? <div className='general-setting-color-picker-item clearfix'>
          <label className='float-left'>Text Color</label>
          <div className='float-right color-picker-container'>
            <ColorPicker id={this.props.textOption.id} color={this.props.textOption.color} onChange={color => {this.props.textOption.onColorChange(color.hex, this.props.textOption.id)}}></ColorPicker>
          </div>
        </div> : null}

        {this.props.backgroundOption ? <div className='general-setting-color-picker-item clearfix'>
          <label className='float-left'>Background</label>
          <div className='float-right color-picker-container'>
            <ColorPicker id={this.props.backgroundOption.id} color={this.props.backgroundOption.color} onChange={color => {this.props.backgroundOption.onColorChange(color.hex, this.props.backgroundOption.id)}}></ColorPicker>
          </div>
        </div> : null}

        {this.props.linkOption ? <div className='general-setting-color-picker-item clearfix'>
          <label className='float-left'>Link Color</label>
          <div className='float-right color-picker-container'>
            <ColorPicker id={this.props.linkOption.id} color={this.props.linkOption.color} onChange={color => {this.props.linkOption.onColorChange(color.hex, this.props.linkOption.id)}}></ColorPicker>
          </div>
        </div> : null}

      </div>
    );
  }
}

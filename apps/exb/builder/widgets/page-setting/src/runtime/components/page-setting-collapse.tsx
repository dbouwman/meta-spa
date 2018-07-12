import {BaseWidget, AllWidgetProps, React} from 'jimu-core';
import {IMConfig} from '../../config';
import {Collapse, Input, Switch} from 'jimu-ui';
import ColorPicker from 'jimu-ui/lib/components/color-picker';

type OnChangeType = (e, l: string) => void;

interface OptionType{
  onChange: OnChangeType;
  label: string;
}

interface Props{
  onVisibleChange: (checked: boolean) => void;
  isOpen?: boolean;
  title?: string;
  size: number;
  togglable?: boolean;
  resizable?: boolean;
  background?: string;
  heightOption?: OptionType;
  backgroundOption?: OptionType;
  widthOption?: OptionType;
  collapsibleOption?: OptionType;
  resizeableOption?: OptionType;
}

interface State{
}

export default class Widget extends React.PureComponent<Props, State>{

  constructor(props){
    super(props);
    this.state = {
    }
  }

  onChange = (checked) => {
    this.props.onVisibleChange(checked);
  }

  render(){
    return (
      <div className='widget-builder-component-page-setting-collapse'>
        <div className='setting-title' style={{display: this.props.title ? 'flex' : 'none'}}>
          <div>{this.props.title}</div>
          <Switch checked={this.props.isOpen} className='mr-4' onChange={this.onChange}/>
        </div>
        <Collapse isOpen={this.props.isOpen || this.props.isOpen}>
          <div className='setting-line' style={{display: this.props.heightOption ? 'flex' : 'none'}}>
            <label>Height</label><Input className='setting-line-input' type='text' value={this.props.size}
              onChange={e => this.props.heightOption.onChange(e.target.value, this.props.heightOption.label)}/><span>px</span>
          </div>
          <div className='setting-line' style={{display: this.props.backgroundOption ? 'flex' : 'none'}}>
            <label>Background</label>
            {this.props.backgroundOption && <ColorPicker id="color-11" color={this.props.background} onChange={(color) => this.props.backgroundOption.onChange(color.hex, this.props.backgroundOption.label)}></ColorPicker>}
          </div>
          <div className='setting-line' style={{display: this.props.widthOption ? 'flex' : 'none'}}>
            <label>Width</label><Input className='setting-line-input' type='text' value={this.props.size}
              onChange={e => this.props.widthOption.onChange(e.target.value, this.props.widthOption.label)}/><span>px</span>
          </div>
          <div className='setting-line' style={{display: this.props.collapsibleOption ? 'flex' : 'none'}}>
            <label>Collapsible</label><Input type='checkbox' checked={this.props.togglable}
              onChange={e => this.props.collapsibleOption.onChange(e.target.checked, this.props.collapsibleOption.label)}/>
          </div>
          <div className='setting-line' style={{display: this.props.resizeableOption ? 'flex' : 'none'}}>
            <label>Resizeable</label><Input type='checkbox' checked={this.props.resizable}
              onChange={e => this.props.resizeableOption.onChange(e.target.checked, this.props.resizeableOption.label)}/>
          </div>
        </Collapse>
      </div>
    );
  }
}

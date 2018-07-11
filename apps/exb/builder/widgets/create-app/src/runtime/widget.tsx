import * as classnames from 'classnames';

import { Input, Button, Image} from 'jimu-ui';
import { BaseWidget } from 'jimu-core';
import { AllWidgetProps, appConfigUtils, IMState, browserHistory, React, changePage } from 'jimu-core';
import { appServices } from 'jimu-for-builder';
//import PortalItem = require('esri/portal/PortalItem');
//import * as defThumbnail from './assets/def_thum.png';
import './css/style.scss';

interface WState {
  name: string,
  description: string,
  tags: Array<string>,
  thumbnailUrl: string,
  btText: 'OK' | 'Creating' | 'error',
  focusItem: 'title' | 'tag' | 'desc' | ''
}
interface Props {
  templateName: string;
}
export default class Widget extends BaseWidget<AllWidgetProps<{}> & Props, WState>{
  titleNode: HTMLInputElement;

  static mapExtraStateProps = (state: IMState, ownProps?: AllWidgetProps<{}>) => {
    return {
      templateName: state.builder.templateName
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      tags: [],
      thumbnailUrl: '',
      btText: 'OK',
      focusItem: ''
    };
  }

  componentDidMount() {
    if (this.titleNode) {
      this.titleNode.focus();
    }
  }

  onCreateClick = () => {
    if (!this.state.name) {
      return;
    }
    this.setState({ btText: 'Creating' });
    appServices.createApp({
      template: this.props.templateName,
      name: this.state.name,
      description: this.state.description,
      tags: this.state.tags
      // thumbnailUrl: this.state.thumbnailUrl
    }).then(item => {
      this.setState({ btText: 'OK' });
      browserHistory.push(`?id=${item.id}`);
    }, err => {
      console.error(err);
      this.setState({ btText: 'error' });
    });
  }

  onNameBured(name) {
    this.setState({ focusItem: '' })
    this.setState({ name });
  }

  onDescBured(description) {
    this.setState({ focusItem: '' })
    this.setState({ description });
  }

  onTagsBured(tagsText) {
    this.setState({ focusItem: '' })
    var tags = tagsText.split(',');
    this.setState({ tags });
  }

  onThumbnailChanged(evt) {
    var file = (evt.target.files && evt.target.files[0]) || (evt.files && evt.files[0]);
    var reader = new FileReader();
    reader.onload = function (e) {
      var scr = e.target.result;
      this.setState({ thumbnailUrl: scr });
    }.bind(this);
    reader.readAsDataURL(file);
  }

  onCloseCreatePage = () => {
    changePage('template');
  }

  onItemFouce = (focusItem) => {
    this.setState({ focusItem })
  }

  render() {
    if (!this.props.templateName) {
      return 'no template';
    }
    const { focusItem } = this.state;
    return <div className='widget-builder-create-app'>
      <div className='create-app-header'>
        <h1>Experience Info</h1>
        <span className='create-app-header-close' onClick={this.onCloseCreatePage}></span>
      </div>

      <div className='create-app-body'>
        {/* <div className='left-panel'>
          <img src={this.state.thumbnailUrl || defThumbnail} style={{ width: '450px', height: '300px' }} ></img>
          <input style={{ width: '146px', height: '30px' }} type='file' accept='image/gif,image/jpeg,image/jpg,image/png,image/svg' name='Choose image' onChange={e => this.onThumbnailChanged(e)} />
        </div> */}
        <div className='create-app-body-left'>
          <img src={`../templates/${this.props.templateName}/thumbnail.png`} />
        </div>
        <div className='create-app-body-right'>
          <div className={focusItem === 'title' ? 'create-app-body-item focus' : 'create-app-body-item'}>
            <Input innerRef={ref => this.titleNode = ref} onFocus={() => this.onItemFouce('title')} type='text' placeholder='Title' onBlur={e => this.onNameBured(e.target.value)} />
          </div>
          <div className={focusItem === 'tag' ? 'create-app-body-item focus' : 'create-app-body-item'}>
            <Input  onFocus={() => this.onItemFouce('tag')} type='text' placeholder='Tags' onBlur={e => this.onDescBured(e.target.value)} />
          </div>
          <div className={focusItem === 'desc' ? 'create-app-body-item focus' : 'create-app-body-item'}>
            <Input  onFocus={() => this.onItemFouce('desc')} type='text' placeholder='Summary' onBlur={e => this.onTagsBured(e.target.value)} />
          </div>
          <div className='create-app-body-button clearfix'>
            <Button outline color='secondary' onClick={this.onCreateClick}>{this.state.btText}</Button>
            <Button outline color='secondary' onClick={this.onCloseCreatePage}>Cancel</Button>
          </div>
        </div>

        <div className={classnames('jimu-primary-loading', {'d-none': this.state.btText !== 'Creating'})}></div>
      </div>

    </div>;
  }
}

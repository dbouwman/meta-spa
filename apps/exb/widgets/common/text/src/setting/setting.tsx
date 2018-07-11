import { React } from 'jimu-core';
import { BaseWidgetSetting, AllWidgetSettingProps } from 'jimu-for-builder';
import { IMConfig } from '../config';
import EditorPanel from './editor-panel';
import './css/style.scss';

export default class Setting extends BaseWidgetSetting<AllWidgetSettingProps<IMConfig>, any>{
  subToken: any;
  constructor(props) {
    super(props);
    this.state = { editorState: null };

  }
  onChange = (editorState) => {
    this.publishTopicWithEditState(editorState);
  }

  wormholeCallback = (wormholeData) => {
    this.setState({ editorState: wormholeData });
  }

  publishTopicWithEditState = (editorState) => {
    window._builderPubsub.publish('widget_setting_' + this.props.id + '_wormhole', editorState);
  }

  publishTopicFetchEditState = () => {
    window._builderPubsub.publish('widget_setting_' + this.props.id + '_fetch_editor_state', null);
  }

  componentDidMount() {
    this.widgetWormhole();
    let { editorState } = this.state;
    if (!editorState) {
      this.publishTopicFetchEditState();
    }
  }

  componentWillUnmount() {
    if (this.subToken) {
      window._builderPubsub.unsubscribe(this.subToken);
    }
  }

  widgetWormhole = () => {
    this.subToken = window._builderPubsub.subscribe('widget_runtime_' + this.props.id + '_wormhole', function (evt, wormholeData) {
      this.wormholeCallback(wormholeData);
    }.bind(this));
  }

  render() {
    const { editorState } = this.state;
    return <div className="text-setting">
      {editorState && <EditorPanel editorState={editorState} onChange={this.onChange} ></EditorPanel>}
    </div>
  }
}
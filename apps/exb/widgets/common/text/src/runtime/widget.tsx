import { BaseWidget, React, ReactDOM, appBuilderSync } from 'jimu-core';
import { AllWidgetProps, IMState, appActions, amdRequire } from 'jimu-core';
import { IMConfig } from '../config';
import { Sanitizer } from '@esri/arcgis-html-sanitizer';
import { isDescendant } from './utils';
import './css/style.scss';

const whiteList = {
  h1: [],
  h2: [],
  h3: [],
  h4: [],
  h5: [],
  h6: [],
  small: []
};

interface Props {
  isInBuilder: boolean;
  appMode: any;
}

interface State {
  Editor: any;
  editorState?: Draft.EditorState;
}

export default class Widget extends BaseWidget<AllWidgetProps<IMConfig> & Props, State>{
  domNode: HTMLDivElement;
  EditorNode: any;
  subTokens: Array<any>;
  constructor(props) {
    super(props);

    this.state = {
      Editor: null
    };
    this.subTokens = [];
  }

  static mapExtraStateProps = (state: IMState) => {
    return {
      isInBuilder: state.appContext.isInBuilder,
      appMode: state.appMode
    }
  };

  componentWillMount() {
    const { isInBuilder } = this.props;
    if (!isInBuilder) {
      return;
    }

    amdRequire(['jimu-for-builder/editor']).then((Editor) => {
      this.setState({
        Editor: Editor
      })
    });
  }

  componentDidMount() {
    const { isInBuilder } = this.props;
    if (!isInBuilder) {
      return;
    }
    this.settingWormhole();
    this.bindExitEditModeEvent();
  }

  componentDidUpdate() {
    const { text, raw } = this.props.config;
    const { Editor, editorState } = this.state;
    if (!Editor) {
      return;
    }
    if (!editorState) {
      let config = {
        html: text,
        raw: raw
      };
      const { getEditStateByWidgetConfig, linkDecorator, EditorState } = Editor;
      let nextEditorState = getEditStateByWidgetConfig(config);
      let newEditorState = EditorState.set(nextEditorState, { decorator: linkDecorator });

      this.setState({ editorState: newEditorState });
      this.publishTopicWithEditState(newEditorState);
    }

    const { isSetting, appMode } = this.props;
    if (appMode === 'DESIGN') {
      return;
    }
    if (this.EditorNode) {
      if (isSetting) {
        if (!this.EditorNode.isEnableEditor()) {
          this.EditorNode.focusEditor();
        }
      } else {
        if (this.EditorNode.isEnableEditor()) {
          this.EditorNode.blurEditor();
        }
      }
    }
  }

  showOverlay = () => {
    const { isInBuilder, isSetting, appMode } = this.props;
    return isInBuilder && !isSetting && appMode === 'DESIGN';
  }

  publishTopicWithEditState = (editorState) => {
    window.top._builderPubsub.publish('widget_runtime_' + this.props.id + '_wormhole', editorState);
  }

  componentWillUnmount() {
    if (this.subTokens.length) {
      this.subTokens.forEach((subToken) => window.top._builderPubsub.unsubscribe(subToken));
      this.subTokens = [];
    }
  }

  wormholeCallback = (wormholeData) => {
    this.setState({ editorState: wormholeData });
    if (this.EditorNode) {
      this.EditorNode.focusEditor();
    }
  }

  settingWormhole = () => {
    const subToken1 = window.top._builderPubsub.subscribe('widget_setting_' + this.props.id + '_wormhole', function (evt, wormholeData) {
      this.wormholeCallback(wormholeData);
    }.bind(this));
    const subToken2 = window.top._builderPubsub.subscribe('widget_setting_' + this.props.id + '_fetch_editor_state', function (evt) {
      const { editorState } = this.state;
      this.publishTopicWithEditState(editorState);
    }.bind(this));
    this.subTokens.push(subToken1);
    this.subTokens.push(subToken2);
  }

  onChange = (html: string, raw: string, editorState: Draft.EditorState) => {
    this.setState({ editorState: editorState });
    this.publishTopicWithEditState(editorState);
    this.setEeitorStateToConfig(html, raw, editorState);
  }

  setEeitorStateToConfig = (html: string, raw: string, editorState: Draft.EditorState) => {
    appBuilderSync.publishWidgetConfigChangeToBuilder(this.props.id, { text: html, raw: raw });
  }

  exitEditMode = () => {
    this.props.dispatch(appActions.setWidgetIsSettingState(this.props.id, false));
  }

  bindExitEditModeEvent = () => {
    if (!this.domNode) {
      return;
    }
    const { appMode } = this.props;
    document.body.addEventListener('mousedown', (e) => {
      if (!this.domNode) {
        return;
      }
      if (appMode && appMode === 'DESIGN') {
        return;
      }
      let target = e.target;
      if (!isDescendant(target, this.domNode)) {
        this.exitEditMode();
      }
    })
  }

  render() {
    const { text } = this.props.config;
    const { isInBuilder } = this.props;
    const { Editor, editorState } = this.state;
    const showOverlay = this.showOverlay();
    // sanitize html
    // let sanedhtml = '';
    // if (text) {
    //   const sanitizer = new Sanitizer({
    //     whiteList
    //   }, true);
    //   sanedhtml = sanitizer.sanitize(text);
    // }

    let children = <div></div>;
    if (isInBuilder && Editor && editorState) {
      children = <div className="is-in-builder">
        <Editor.Editor ref={ref => this.EditorNode = ref} editorState={editorState} onChange={this.onChange}>
        </Editor.Editor>
      </div>
    } else {
      children = <div className="is-run-time" dangerouslySetInnerHTML={{ __html: text }}></div>;
    }
    return <div className="widget-text" ref={ref => this.domNode = ref}>
      {showOverlay && <div className="overlay"></div>}
      <div>{children}</div>
    </div>;
  }
}

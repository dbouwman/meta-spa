import {BaseWidget, AllWidgetProps, appActions, IMState, AppMode, React, classNames as classnames} from 'jimu-core';
import {IMConfig} from '../config';
import {appStateHistoryActions, WidgetCardType, builderAppSync} from 'jimu-for-builder';
import {appServices} from 'jimu-for-builder';
import {Switch, Icon} from 'jimu-ui';
import {ChooseWidgetSectionPopup} from './components/choose-widget-section-popup';

import './css/style.scss';

interface StateHistory{
  past: IMState[];
  future: IMState[];
}
interface Props{
  stateHistory: StateHistory;
  currentPageId: string;
  currentViewId: string;
}

interface State{
  saveState: string;
  isChooseWidgetOnScreen: boolean;
}
export default class Widget extends BaseWidget<AllWidgetProps<IMConfig> & Props, State>{

  constructor(props){
    super(props);
    this.state = {
      saveState: 'Save',
      isChooseWidgetOnScreen: false
    };
  }

  static mapExtraStateProps = (state) => {
    return {
      stateHistory: state.appStateHistory,
      currentPageId: state.builder.currentPageId,
      currentViewId: state.builder.currentViewId
    }
  };

  onSaveClick = () => {
    this.setState({saveState: 'Saving'});
    appServices.saveApp(this.props.queryObject.id, this.props.appState.appConfig).then(item => {
      this.setState({saveState: 'Done'});
    }, err => {
      console.error(err);
      this.setState({saveState: 'Error'});
    });
  }

  onUndo = () => {
      this.props.dispatch(appStateHistoryActions.InBuilderAppConfigUndo());
  }
  onRedo = () => {
      this.props.dispatch(appStateHistoryActions.InBuilderAppConfigRedo());
  }

  onAppModeChange = () => {
    if(!this.props.appState){
      return;
    }

    if(this.props.appState.appMode === AppMode.Config){
      builderAppSync.publishAppModeChangeToApp(AppMode.Design);
    }else{
      builderAppSync.publishAppModeChangeToApp(AppMode.Config);
      this.setState({
        isChooseWidgetOnScreen: false
      });
    }
  }

  onToggleChooseWidgetPopup = (isShown: boolean) => {
    const mode = isShown ? AppMode.Design : AppMode.Config;
    builderAppSync.publishAppModeChangeToApp(mode);
    this.setState({
      isChooseWidgetOnScreen: isShown
    });
  }

  onLaunch = () => {
    window.open(`../stemapp/?id=${this.props.queryObject.id}`);
  }

  render(){
    const appName = this.props.appState && this.props.appState.appConfig && this.props.appState.appConfig.attributes.title || '';
    return <header className='widget-builder-header'>
            {/* <section className='header-home'>
              <Link to="?page=home">{this.props.nls.home}</Link>
            </section> */}
            <section className='header-nav-container clearfix'>
              <div className='header-left float-left d-flex flex-row align-content-center'>
                <button className='btn btn-link header-left-toc' onClick={this.onToggleTOC}>
                  <Icon icon='drag-horizontal' className='drag-horizontal-dark'/>
                </button>
                <h1>{appName}</h1>
              </div>
              <div className='header-right float-right'>
                <button className='header-right-mobile'>
                  <span>Mobile</span>
                </button>
                <button className='header-right-preview' onClick={this.onLaunch}>
                  <span>Launch</span>
                </button>
                <button className='header-right-publish'>
                  <span>Publish</span>
                </button>
              </div>
              <div className='header-main clearfix'>
                <button className='header-main-widgets float-left'
                  onClick={() => {this.onToggleChooseWidgetPopup(!this.state.isChooseWidgetOnScreen)}}>
                  <span>Insert elements</span>
                </button>
                <div className='header-main-undo-redo float-right'>
                    <button className={classnames({'header-button-disabled': this.props.stateHistory.past.length > 1 ? false : true})}
                      onClick={this.onUndo} disabled={this.props.stateHistory.past.length > 1 ? false : true}>
                      <span>Undo</span>
                    </button>
                    <button className={classnames({'header-button-disabled': this.props.stateHistory.future.length > 0 ? false : true})}
                      onClick={this.onRedo} disabled={this.props.stateHistory.future.length > 0 ? false : true}>
                      <span>Redo</span>
                    </button>
                </div>
                <button className='header-main-save float-right' onClick={this.onSaveClick}>
                  <span>{this.state.saveState}</span>
                </button>
                <div className='header-main-mode float-right'>
                  <span>Design mode</span>
                  <Switch onChange={this.onAppModeChange} className='header-main-mode-switch' checked={this.props.appState && this.props.appState.appMode === AppMode.Design}/>
                </div>
              </div>
            </section>
            <section>
              <ChooseWidgetSectionPopup appState={this.props.appState} currentPageId={this.props.currentPageId} currentViewId={this.props.currentViewId} dispatch={this.props.dispatch} isOnScreen={this.state.isChooseWidgetOnScreen}
                    onTogglePopup={s => {this.onToggleChooseWidgetPopup(s)}}/>
            </section>
          </header>;

  }

  // FOR DEMO:
  onToggleTOC = () => {
    let leftToggle = document.getElementsByClassName('sidebar_handler_left');
    if(leftToggle) {
      (leftToggle[0] as HTMLElement).click();
    }
  }
  // TODO: REMOVE AFTER DEMO
}

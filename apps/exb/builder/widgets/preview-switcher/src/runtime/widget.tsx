import * as classnames from 'classnames';

import {BaseWidget, React} from 'jimu-core';
import {AllWidgetProps} from 'jimu-core';

export default class Widget extends BaseWidget<AllWidgetProps<{}>, any>{

  onBtnClick = () => {
    // this.props.dispatch(actions.inBuilderToggleAppMode());
  };

  render(){
    return <div style={{width: '100%', height: '40px'}}>
      <button onClick={this.onBtnClick}>{this.props.appState && this.props.appState.isAppEditing? 'Done': 'Edit Layout'}</button>
    </div>;
  }
}

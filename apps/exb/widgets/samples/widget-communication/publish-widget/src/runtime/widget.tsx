// import * as classnames from 'classnames';


import {BaseWidget, React, ReactDOM, AllWidgetProps, MessageManager, StringSelectionChangeMessage} from 'jimu-core';

export default class Widget extends BaseWidget<AllWidgetProps<{}>, any>{

  constructor(props){
    super(props);
  }

  onStateChange = (evt: React.FormEvent<HTMLSelectElement>) => {
    MessageManager.getInstance().publishMessage(new StringSelectionChangeMessage(this.props.id, evt.currentTarget.value));
  };

  render(){
    return <div className="widget-pub">
      <label>State:</label>
      <select onChange={this.onStateChange}>
        <option value="CA">CA</option>
        <option value="HI">HI</option>
      </select>
    </div>;
  }
}

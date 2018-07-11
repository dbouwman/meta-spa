import { BaseWidget, React } from 'jimu-core';
import { AllWidgetProps } from 'jimu-core';
import * as classnames from 'classnames';
import './css/style.scss';
import {IMConfig} from '../config';
import {UserMenu} from 'jimu-ui';

export default class Widget extends BaseWidget<AllWidgetProps<IMConfig>, {}>{

  constructor(props) {
    super(props);
  }

  render() {
    // get user, sign in/out actions, CSS class names from props
    const {
      user,
      onSignIn,
      onSignOut,
      className
    } = this.props;

    // merge CSS class names
    const classes = classnames(
      'widget-user-menu',
      className
    );

    return <div className={classes}><UserMenu user={user} onSignIn={onSignIn} onSignOut={onSignOut} /></div>;
  }
}

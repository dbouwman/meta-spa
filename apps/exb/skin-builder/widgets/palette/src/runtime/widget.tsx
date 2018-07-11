import { BaseWidget, React, AllWidgetProps } from 'jimu-core';
import { IMConfig } from '../config';

export default class Widget extends BaseWidget<AllWidgetProps<IMConfig>, any>{
  render() {
    return <header>
      This will be the palette of the Skin Builder
    </header>;
  }
}

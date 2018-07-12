import { BaseWidget, React, ReactDOM } from 'jimu-core';
import { AllWidgetProps } from 'jimu-core';
import * as classnames from 'classnames';
import { Image, ImageProps as BaseImageProps } from 'jimu-ui';
import './css/style.scss';

interface ImageProps extends BaseImageProps {
  transparency: number
  // requirements from HUB:
  //  caption?: string,
  // hyperlink: string,
  // hyperlinkTabOption: string
}

export default class Widget extends BaseWidget<AllWidgetProps<ImageProps>, {}>{

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    console.log(`...Render ${this.props.manifest.name}`);

    const {
      transparency,
      ...other
    }: ImageProps = this.props.config;

    const style = {
      opacity: transparency
    }

    return <Image
      style = {style}
      {...other}
    />;
  }
}

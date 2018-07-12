
import * as React from 'react';
import * as classnames from 'classnames';

const iconsJson = require('./calcite-icons/selection.json');

function getPath(iconName) {
  
  const icon = iconsJson.icons.find(icon => icon.properties.name === iconName);

  if (icon) {
    return icon.icon.paths.join(' ');
  } else {
    console.warn(`icon ${iconName} does not exist.`);
    return '';
  }
}

export interface IconProps {
  icon: string;
  className?: string;
  style?: React.CSSProperties;
  width?: number | string,
  height?: number | string,
  size?: number | string,
  fill?:string;
}

export class Icon extends React.PureComponent<IconProps> {

  render() {
    const {
      icon,
      className,
      style,
      width,
      height,
      fill,
      size
    } = this.props;

    const classes = classnames(
      className,
      'jimu-icon',
      `esri-icon-${icon}`
    );

    return <svg width={size || width || 16} height={size || height || 16} fill={fill} viewBox="0 0 1024 1024"
      className={classes} style={style}>
      <path d={getPath(icon)}></path>
    </svg>
  }
}

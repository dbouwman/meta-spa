import { ImmutableObject } from 'seamless-immutable';
import { IconProps } from 'jimu-ui';

export type GoTo = {
  page: string;
  views: string[];
}

export enum LinkStyles {
  Text = 'TEXT',
  Button = 'BUTTON',
  Button_Outline = 'BUTTON_OUTLINE',
  Image = 'IMAGE' // TODO
}

export interface Config {
  name?: string;
  goto: GoTo;
  style?: LinkStyles;
  color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger',
  width?: number | string;
  height?: number | string;
  icon?: IconProps;
  className?: string;
}

export type IMConfig = ImmutableObject<Config>;
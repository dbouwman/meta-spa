import {ImmutableObject} from 'seamless-immutable';
import {ImageProps} from 'jimu-ui';

// TODO: move to core
interface WidgetStyle {
  name: string;
}
// END: TODO

export interface ImageConfig extends ImageProps {
  field: string;
}

export type ImageType = ImmutableObject<ImageConfig>;

export enum DescriptionTypes {
  "text" = "TEXT",
  "list" = "LIST"
}

export interface fieldItem {
  icon: ImmutableObject<{
    name: string; 
  }>;
  field: string;
}

export interface Config {
  dataSourceId: string;
  layerId?: string;
  image?: ImageType;
  title?: {
    field: string;
  };
  description?: {
    field: string;
    type?: DescriptionTypes;
    limit?: number;
    fields?: Array<fieldItem>;
  };
  className?: string; // TODO: move to widget base
  style?: WidgetStyle;
}

export type IMConfig = ImmutableObject<Config>
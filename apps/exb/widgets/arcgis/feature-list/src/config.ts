import { ImmutableObject } from 'seamless-immutable';
import { ImageProps } from 'jimu-ui';

// TODO: move to core
export interface gotoProps {
  views: string[]
}
export interface gotoAction {
  goto: gotoProps;
}
export type IMgotoAction = ImmutableObject<gotoAction>;

interface WidgetHeaderTitle {
  text: string;
  // Add color, size, alignment, etc.
  // Add an option to bind text to a field
}

export interface WidgetHeader {
  title: ImmutableObject<WidgetHeaderTitle>;
  // TODO: 
  // Add "action" such as filter 
}

interface WidgetStyle {
  name: string;
}
// END: TODO

interface ListItemComponent {
  field: string;
}

interface ListItemTitleComponent extends ListItemComponent { }
interface ListItemDescriptionComponent extends ListItemComponent { }
interface ListItemImageComponent extends ListItemComponent, ImageProps {}

export interface Config {
  dataSourceId: string;
  layerId?: string;
  title: ImmutableObject<ListItemTitleComponent>;
  description?: ImmutableObject<ListItemDescriptionComponent>;
  image?: ImmutableObject<ListItemImageComponent>;
  limit?: number;
  horizontal?: boolean;
  onItemSelect?: IMgotoAction; // | other types
  highlightSelection?: boolean;
  header?: ImmutableObject<WidgetHeader>;
  cardWidth?: number;
  style?: WidgetStyle;
}

export type IMConfig = ImmutableObject<Config>;
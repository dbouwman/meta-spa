import {ImmutableObject} from 'seamless-immutable';

interface IViewUI {
  padding: ImmutableObject<{
    top?: number,
    bottom?: number,
    left?: number,
    right?: number
  }> | number;
}

interface ICenterAt {
  target: string | [x: number, y: number];
  zoom?: number;
}

export interface Config{
  webmapId: string;
  extent?: object;
  canZoom?: boolean;
  canScale?: boolean;
  canGoHome?: boolean;
  canGoExtent?: boolean;
  canOverviewMap?: boolean;
  canLocate?: boolean;
  disablePopup?: boolean;
  excludeUnselected?: boolean; // TODO: might need some discussion
  centerAt?: ImmutableObject<ICenterAt>;
  ui?: ImmutableObject<IViewUI>;
}

export type IMConfig = ImmutableObject<Config>;

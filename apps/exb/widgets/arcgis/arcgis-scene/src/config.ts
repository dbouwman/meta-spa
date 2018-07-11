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
  tilt?: number;
}

export interface Config{
  websceneId: string;
  canZoom?: boolean;
  canNavigate?: boolean;
  canGoHome?: boolean;
  canCompass?: boolean;
  canLocate?: boolean;
  disablePopup?: boolean;
  excludeUnselected?: boolean; // TODO: might need some discussion
  centerAt?: ImmutableObject<ICenterAt>;
  ui?: ImmutableObject<IViewUI>;
}

export type IMConfig = ImmutableObject<Config>;

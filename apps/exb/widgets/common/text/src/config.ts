import { ImmutableObject } from 'seamless-immutable';

export interface Config {
  text: string;
  raw: string;
}

export type IMConfig = ImmutableObject<Config>;
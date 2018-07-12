import { ImmutableObject } from 'seamless-immutable';

export interface Config {
  libraries: string[]
}

export type IMConfig = ImmutableObject<Config>;
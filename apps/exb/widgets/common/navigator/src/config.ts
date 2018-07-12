import { ImmutableObject } from 'seamless-immutable';

interface Link {
    name: string;
    views: Array<string>
}
export interface Config {
    links: Array<Link>
}

export type IMConfig = ImmutableObject<Config>;
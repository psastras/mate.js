// tslint:disable-next-line:no-reference
/// <reference path="../typings/index.d.ts"/>

import Numbers from './primitives/numbers';
import Objects from './primitives/objects';
import ArrayMultimap from './collections/arraymultimap';
import HashBiMap from './collections/hashbimap';
import MapMultiset from './collections/mapmultiset';
import MultisetMultimap from './collections/multisetmultimap';
import ImmutableMap from './collections/immutablemap';
import ImmutableSet from './collections/immutableset';
import ImmutableList from './collections/immutablelist';
import ImmutableMultimap from './collections/immutablemultimap';

// tslint:disable-next-line:variable-name
export const Collections = {
    ArrayMultimap,
    MultisetMultimap,
    MapMultiset,
    HashBiMap,
    ImmutableMap,
    ImmutableSet,
    ImmutableList,
    ImmutableMultimap,
};

// tslint:disable-next-line:variable-name
export const Primitives = {
    Objects,
    Numbers,
};
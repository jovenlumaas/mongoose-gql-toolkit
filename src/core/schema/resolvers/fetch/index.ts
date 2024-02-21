import { makeFetchArrayFn } from './fetchArray';
import { makeFetchRecordFn } from './fetchRecord';
// types
import type { TFetchArrayFn } from './fetchArray';
import type { TFetchRecordFn } from './fetchRecord';

export type TCreateFetchMethodsFn<TFetchTags> = <T = TFetchTags>(
  fetchTags: T,
) => {
  fetchArray: ReturnType<TFetchArrayFn<TFetchTags>>;
  fetchRecord: ReturnType<TFetchRecordFn<TFetchTags>>;
};

export const createFetchMethods = <T = any>(fetchTags: T) => {
  return {
    fetchArray: makeFetchArrayFn(fetchTags),
    fetchRecord: makeFetchRecordFn(fetchTags),
  };
};

export * from './fetchTags';

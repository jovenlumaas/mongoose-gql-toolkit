// types
import type { TDataLoaderInit } from "./__types";

type TMergedDataLoaders<T> = {
  [P in keyof T]: T[P];
};

type TMergeLoadersFn = <T extends Record<string, TDataLoaderInit>>(
  loaderHandlers: T
) => TMergedDataLoaders<T>;

export const mergeLoaders: TMergeLoadersFn = (loaderHandlers) => {
  return Object.keys(loaderHandlers).reduce(
    (acc, key) => ({ ...acc, [key]: loaderHandlers[key] }),
    {} as any
  );
};

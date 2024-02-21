// types
import type { TDataLoaderInit } from "./__types";

type TMergedDataLoaders<T extends Record<string, TDataLoaderInit>> = {
  [P in keyof T]: ReturnType<T[P]>;
};

type TMergeLoadersFn = <T extends Record<string, TDataLoaderInit>>(
  loaderHandlers: T
) => TMergedDataLoaders<T>;

export const loadersInit: TMergeLoadersFn = (loaderHandlers) => {
  return Object.keys(loaderHandlers).reduce(
    (acc, key) => ({ ...acc, [key]: loaderHandlers[key]() }),
    {} as any
  );
};

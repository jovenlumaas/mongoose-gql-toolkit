import { generateLoader } from "./__core";
import { createFetchMethods } from "../fetch";
// types
import type { TLoaderInfoMap, TDataLoaderInit } from "./__types";

type MappedBatchLoadFn<TLoaders extends Record<string, any>> = {
  [P in keyof TLoaders]: TDataLoaderInit;
};

type TMakeCreateLoaderFn = <TModels, TFetchTags>(
  models: TModels,
  fetchTags: TFetchTags
) => <TLoaders extends TLoaderInfoMap<TModels, TFetchTags>>(
  loaderHandlers: TLoaders
) => MappedBatchLoadFn<TLoaders>;

export const makeCreateLoaderFn: TMakeCreateLoaderFn =
  (models, fetchTags) => (loaderHandlers) => {
    const fetch = createFetchMethods(fetchTags);

    return Object.keys(loaderHandlers).reduce((acc, key) => {
      return {
        ...acc,
        [key]: generateLoader({
          models,
          fetch,
          loader: loaderHandlers[key as keyof typeof loaderHandlers] as any,
        }),
      };
    }, {}) as any;
  };

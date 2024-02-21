import { makeCreateLoaderFn } from './createLoaders';

type TDataLoaderMethodsProps<TModels, TFetchTags> = {
  models: TModels;
  fetchTags: TFetchTags;
};

export const createLoaderMethods = <TModels, TFetchTags>({
  models,
  fetchTags,
}: TDataLoaderMethodsProps<TModels, TFetchTags>) => {
  return {
    createLoader: makeCreateLoaderFn<TModels, TFetchTags>(models, fetchTags),
  };
};

export * from './mergeLoaders';
export * from './loaderResolvers';
export * from './loadersInit';

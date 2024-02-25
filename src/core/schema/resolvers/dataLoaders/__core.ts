import DataLoader from 'dataloader';

// types
import type { TLoaderInfo } from './__types';

// **************************** For resolveModelLoader ********************************* //

type TResolveModelLoaderFn = (
  dataSourceOptions: { models: Record<string, any>; keys: readonly any[] },
  loaderInfo: Pick<TLoaderInfo, 'model' | 'type' | 'matchKey' | 'where'>,
) => Promise<any>;

const resolveModelLoader: TResolveModelLoaderFn = async (
  { models, keys },
  { model, type, matchKey = '_id', where },
) => {
  // resolver
  const collections = await models[model as keyof typeof models].find({
    [matchKey]: keys,
    ...where,
  });

  const fetchType = type === 'record' ? 'find' : 'filter';
  const loaded = keys.map((key) => {
    return collections[fetchType]((item: any) => {
      if (matchKey === '_id') return item._id.toString() === key?.toString();
      return item[matchKey] === key;
    });
  });

  return loaded;
};

// **************************** For resolveFetchLoader ********************************* //

type TResolveFetchLoaderFn = (
  dataSourceOptions: { fetch: Record<string, any>; keys: readonly any[] },
  loaderInfo: Pick<TLoaderInfo, 'gqlTag' | 'type' | 'matchKey' | 'where' | 'payloadNode'>,
) => Promise<any>;

const resolveFetchLoader: TResolveFetchLoaderFn = async (
  { fetch, keys },
  { gqlTag, type, matchKey = '_id', where, payloadNode },
) => {
  const fetchMethod = type === 'record' ? 'fetchRecord' : 'fetchArray';
  // resolver
  const collections = await fetch[fetchMethod](gqlTag, {
    variables: { [matchKey]: keys, ...where },
    payloadNode,
  });

  const fetchType = type === 'record' ? 'find' : 'filter';
  return keys.map((key) =>
    collections[fetchType]((item: any) => {
      if (matchKey === '_id') return item._id.toString() === key?.toString();
      return item[matchKey] === key;
    }),
  );
};

// **************************** For generateLoader ********************************* //

export type TGenerateLoaderProps<TModels = any, TFetch = any> = {
  models: TModels;
  fetch: TFetch;
  loader: TLoaderInfo<TModels, any>;
};

const generateLoader = ({ models, fetch, loader }: TGenerateLoaderProps) => {
  const { source, type, matchKey, where, batchFunction, ...rest } = loader;

  const loaderCallback = (keys: readonly string[]) => {
    switch (source) {
      case 'model': {
        const { model } = rest;
        return resolveModelLoader(
          { models, keys },
          {
            model,
            type,
            matchKey,
            where,
          },
        );
      }

      case 'api': {
        const { gqlTag, payloadNode } = rest;
        return resolveFetchLoader(
          { fetch, keys },
          {
            type,
            matchKey,
            where,
            gqlTag,
            payloadNode,
          },
        );
      }

      case 'function': {
        if (batchFunction) {
          return batchFunction(keys);
        } else {
          throw new Error(`Cannot create loader for source '${source}'`);
        }
      }

      default: {
        throw new Error(`Cannot create loader for source '${source}'`);
      }
    }
  };

  // IMPORTANT to always generate a new Dataloader per request to avoid data leak when access permissions are used.
  // DO NOT RETURN a FUNCTION, should only return DateLoader instance so that caching will work.
  return () => new DataLoader(loaderCallback);
};

export { generateLoader };

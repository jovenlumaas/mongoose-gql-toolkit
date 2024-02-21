import type DataLoader from "dataloader";

interface ILoaderBasic {
  type: "record" | "list";
  matchKey?: string;
  where?: Record<string, any>;
}

interface ILoadFromModel<TModels = any> extends ILoaderBasic {
  source: "model";
  model: keyof TModels;
  gqlTag?: never;
  payloadNode?: never;
  batchFunction?: never;
}

interface ILoadFromApi<TFetchTags> extends ILoaderBasic {
  source: "api";
  model?: never;
  gqlTag: keyof TFetchTags;
  payloadNode: string;
  batchFunction?: never;
}

interface ILoadFromFunction {
  source: "function";
  batchFunction: (keys: readonly string[]) => Promise<any[]>;
  type?: never;
  matchKey?: never;
  where?: never;
  model?: never;
  gqlTag?: never;
  payloadNode?: never;
}

export type TLoaderInfo<TModels = any, TFetchTags = any> =
  | ILoadFromModel<TModels>
  | ILoadFromApi<TFetchTags>
  | ILoadFromFunction;

export type TLoaderInfoMap<TModels = any, TFetchTags = any> = {
  [key: string]: TLoaderInfo<TModels, TFetchTags>;
};

export type TDataLoaderInit = () => DataLoader<any, any>;

import { getNestedValue } from '../../../../utils';

// types
import type { TFetchOptions } from './__types';

export type TFetchRecordFn<TFetchTags> = (
  fetchTags: TFetchTags,
) => (query: keyof TFetchTags, options?: TFetchOptions) => Promise<Record<string, any> | undefined>;

export const makeFetchRecordFn =
  <T = any>(fetchTags: T) =>
  (query: keyof T, options?: TFetchOptions): Promise<Record<string, any> | undefined> => {
    const { variables, payloadNode = `data.${String(query)}` } = options ?? {};
    const nodeTag = getNestedValue(fetchTags as any, query as any);

    if (!nodeTag) throw new TypeError(`FETCH ERROR: Can't find query '${String(query)}', please check if it exists`);

    if (typeof nodeTag === 'object') {
      const { url, query: qryTag } = nodeTag;
      const body =
        typeof variables === 'object'
          ? JSON.stringify({ query: qryTag, variables })
          : JSON.stringify({ query: qryTag });

      return fetch(url, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      })
        .then((response) => response.json())
        .then((res) => {
          if (payloadNode) return getNestedValue(res, payloadNode);
          return res;
        })
        .catch((err) => {
          throw new Error(err.message);
        });
    } else {
      return undefined as any;
    }
  };

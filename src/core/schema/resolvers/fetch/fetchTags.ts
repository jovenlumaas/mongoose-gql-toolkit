type TFetchTag = { query: string; url: string };

// ********************** For includeURL ***********************************
type FetchTags<T> = {
  [P in keyof T]: TFetchTag;
};

type TIncludeURLFn = <T extends Record<string, string>, U extends string>(tags: T, url: U) => FetchTags<T>;

const includeURL: TIncludeURLFn = (tags, url) => {
  return Object.keys(tags).reduce((acc, key) => ({ ...acc, [key]: { query: tags[key], url } }), {} as any);
};

// ********************** For mergeFetchTags ***********************************

type TMergedFetchTags<T> = {
  [P in keyof T]: T[P] extends TFetchTag
    ? T[P]
    : T[P] extends Record<string, TFetchTag>
    ? TMergedFetchTags<T[P]>
    : never;
};

const mergeFetchTags = <T extends Record<string, TFetchTag>>(tags: T): TMergedFetchTags<T> => {
  const tagKeys: string[] = [];

  return Object.keys(tags).reduce((acc, key) => {
    if (tagKeys.includes(key)) {
      throw new TypeError(`Error on 'mergeFetchTags': key ${key} is already declared`);
    } else {
      tagKeys.push(key);
      return { ...acc, [key]: tags[key as keyof typeof tags] };
    }
  }, {} as TMergedFetchTags<T>);
};

export { includeURL, mergeFetchTags };

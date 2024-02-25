type ObjectValue = Record<string, any>;

export type TrueOrObject = true | { name?: string; fragment: string };
export type TrueOrObjectWithReturning = true | { name?: string; fragment: string; returning: boolean };
export type TrueOrObjectString = true | { name: string };

export interface CrudOptionProps {
  list?: TrueOrObject;
  read?: TrueOrObject;
  readCache?: TrueOrObject;
  create?: TrueOrObjectWithReturning;
  update?: TrueOrObjectWithReturning;
  delete?: TrueOrObjectString;
}

// ** Common properties */
interface GenerateGQLTag {
  addRawGql: boolean;
  pluralizedName?: string;
  inputName?: string;
}

// ** Option 1: Allows the GenGQL Function to auto-generate CRUD GQLs**/
export interface GenerateGQLIsCrudAuto extends GenerateGQLTag {
  isCrud: boolean;
  __typename: string;
  requiredFragment: string;
  optionalFragment?: string;
  mutationSelectionOptions: {
    create: boolean;
    update: boolean;
  };
  complements?: ObjectValue;
  crudOptions?: never;
}

// ** Option 2: The developer manually assigns CRUD GQLs thru 'crudOptions' property**/
export interface GenerateGQLUsingCrudOptions extends GenerateGQLTag {
  isCrud?: never;
  __typename: string;
  requiredFragment: string;
  optionalFragment?: string;
  mutationSelectionOptions?: never;
  crudOptions: CrudOptionProps;
  complements?: ObjectValue;
}

// ** Option 3: No CRUD GQLs, the developer assigns special GQL in 'complements' property**/
export interface GenerateGQComplementsOnly extends GenerateGQLTag {
  isCrud?: never;
  __typename?: never;
  crudOptions?: never;
  requiredFragment?: never;
  optionalFragment?: never;
  mutationSelectionOptions?: never;
  complements: ObjectValue;
}

export type GQLTagOptions = GenerateGQLIsCrudAuto | GenerateGQLUsingCrudOptions | GenerateGQComplementsOnly;

export type GenerateGQLTagOptions = GQLTagOptions | { [key: string]: GQLTagOptions };

export interface KeyOfDocumentNode {
  [key: string]: any;
}

export type MergedDocumentNodeType = {
  [key: string]: KeyOfDocumentNode | { [key: string]: KeyOfDocumentNode } | string;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * The following is the implementation for inferring GENERATE GQL TAG RESPONSE
 */

type CrudTypes = 'list' | 'create' | 'read' | 'readCache' | 'update' | 'delete';
type MappedRaw<T> = `${string & T}Raw`;

type MapIsCrudDocNode = Record<CrudTypes, string>;
type MapIsCrudDocNodeRaw = Record<MappedRaw<CrudTypes>, string>;
type MapIsCrudDocNodeWithRaw = MapIsCrudDocNode & MapIsCrudDocNodeRaw;

type MapComplementDocNode<C> = Record<keyof C, string>;
type MapComplementDocNodeRaw<C> = Record<MappedRaw<keyof C>, string>;
type MapComplementDocNodeWithRaw<C> = MapComplementDocNode<C> & MapComplementDocNodeRaw<C>;

type MapIsCrudWithComplementDocNode<C> = MapIsCrudDocNode & MapComplementDocNode<C>;
type MapIsCrudWithComplementDocNodeWithRaw<C> = MapIsCrudDocNodeWithRaw & MapComplementDocNodeWithRaw<C>;

type MapCrudOptionDocNode<O> = Record<keyof O, string>;
type MapCrudOptionDocNodeRaw<O> = Record<MappedRaw<keyof O>, string>;
type MapCrudOptionDocNodeWithRaw<O> = MapCrudOptionDocNode<O> & MapCrudOptionDocNodeRaw<O>;

type MapCrudOptionWithComplementDocNode<O, C> = MapCrudOptionDocNode<O> & MapComplementDocNode<C>;
type MapCrudOptionWithComplementDocNodeWithRaw<O, C> = MapCrudOptionDocNodeWithRaw<O> & MapComplementDocNodeWithRaw<C>;

/**
 * Implements 'isCrud'
 */
type CreateGQLIsCrud<T extends any> = T extends GenerateGQLIsCrudAuto & {
  addRawGql: infer A;
  complements?: never;
}
  ? A extends true
    ? MapIsCrudDocNodeWithRaw
    : MapIsCrudDocNode
  : never;

/**
 * Implements 'isCrud' with 'complements'
 */
type CreateGQLIsCrudWithComplement<T extends any> = T extends GenerateGQLIsCrudAuto & {
  addRawGql: infer A;
  complements: infer C;
}
  ? A extends true
    ? MapIsCrudWithComplementDocNodeWithRaw<C>
    : MapIsCrudWithComplementDocNode<C>
  : never;

/**
 * Implements 'complements' only
 */
type CreateGQLComplementsOnly<T extends any> = T extends GenerateGQComplementsOnly & {
  addRawGql: infer A;
  complements: infer C;
}
  ? A extends true
    ? MapComplementDocNodeWithRaw<C>
    : MapComplementDocNode<C>
  : never;

/**
 * Implements 'crudOptions'
 */
type CreateGQLCrudOptions<T extends any> = T extends GenerateGQLUsingCrudOptions & {
  addRawGql: infer A;
  crudOptions: infer O;
  complements?: never;
}
  ? A extends true
    ? MapCrudOptionDocNodeWithRaw<O>
    : MapCrudOptionDocNode<O>
  : never;

/**
 * Implements 'crudOptions' with 'complements'
 */
type CreateGQLCrudOptionsWithComplements<T extends any> = T extends GenerateGQLUsingCrudOptions & {
  addRawGql: infer A;
  crudOptions: infer O;
  complements: infer C;
}
  ? A extends true
    ? MapCrudOptionWithComplementDocNodeWithRaw<O, C>
    : MapCrudOptionWithComplementDocNode<O, C>
  : never;

/**
 * Create a union to combine possible inference based on input value
 * (for query and/or mutation level)
 */
type CreatGqlSingleOption<T extends any> =
  | CreateGQLIsCrud<T>
  | CreateGQLIsCrudWithComplement<T>
  | CreateGQLComplementsOnly<T>
  | CreateGQLCrudOptions<T>
  | CreateGQLCrudOptionsWithComplements<T>;

/**
 * Handles nesting using recursion
 */
type CreatGqlNestedOptions<T> = T extends {
  [key: string]: { addRawGql: boolean };
}
  ? { [P in keyof T]: CreatGqlSingleOption<T[P]> } // CreatGqlSingleOption<T[P]> is the recursion
  : never;

/** Combine all possible inference for createGQL response */
export type CreatGQLResponse<T extends any> = CreatGqlSingleOption<T> | CreatGqlNestedOptions<T>;

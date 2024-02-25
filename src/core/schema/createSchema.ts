import gql from "graphql-tag";

import {
  // common
  createPermissions,
  createFetchMethods,
  // queries
  makeRelayStylePaginationResolverFn,
  makeOffsetLimitPaginationResolverFn,
  makeFindAllResolverFn,
  makeFindByIdResolverFn,
  makeFindOneResolverFn,
  makeCountResolverFn,
  makeRunResolverFn,
  makeLoaderResolverFn,
  makeResolveReferenceLoaderFn,
  makeResolveEntityTypeFn,
  // mutations
  makeCreateOneResolverFn,
  makeUpdateOneResolverFn,
  makeDeleteOneResolverFn,
  makeRestoreDeletedOneResolverFn,
  buildErrorMessage,
  testValidationError,
  runOffsetLimitPaginationQuery,
} from "./resolvers";

// types
import type {
  // common
  TCreateFetchMethodsFn,
  // queries
  TMakeRelayStylePaginationResolverFn,
  TMakeOffsetLimitPaginationResolverFn,
  TMakeFindAllResolverFn,
  TMakeFindByIdResolverFn,
  TMakeFindOneResolverFn,
  TMakeCountResolverFn,
  TMakeRunResolverFn,
  TMakeLoaderResolverFn,
  TMakeResolveReferenceLoaderFn,
  TMakeResolveEntityTypeFn,
  // mutations
  TMakeCreateOneResolverFn,
  TMakeUpdateOneResolverFn,
  TMakeDeleteOneResolverFn,
  TMakeRestoreDeletedOneResolverFn,
  TAuthValidations,
  TCreatePermissionsFn,
} from "./resolvers";
import type { DocumentNode } from "graphql";
import type { TResolverContext, TSchemaModule } from "../../types";

type CreateSchemaCallbackParams<
  TContext extends TResolverContext = any,
  TFetchTags = any,
  TModels = any,
  TSchemaContext = any,
  TModelType = any
> = TSchemaContext & {
  models: TModels;
  gql: (
    template: TemplateStringsArray | string,
    ...substitutions: any[]
  ) => DocumentNode;
  createResolver: ReturnType<TCreatePermissionsFn<TContext>>["createResolver"];
  requiresAuth: ReturnType<TCreatePermissionsFn<TContext>>["requiresAuth"];
  requiresAccess: ReturnType<TCreatePermissionsFn<TContext>>["requiresAccess"];
  requiresAdmin: ReturnType<TCreatePermissionsFn<TContext>>["requiresAdmin"];
  requiresRestriction: ReturnType<
    TCreatePermissionsFn<TContext>
  >["requiresRestriction"];
  // common
  fetch: ReturnType<TCreateFetchMethodsFn<TFetchTags>>;
  // queries
  relayStylePaginationResolver: ReturnType<
    TMakeRelayStylePaginationResolverFn<TContext>
  >;
  offsetLimitPaginationResolver: ReturnType<
    TMakeOffsetLimitPaginationResolverFn<TContext>
  >;
  findAllResolver: ReturnType<TMakeFindAllResolverFn<TContext>>;
  findByIdResolver: ReturnType<TMakeFindByIdResolverFn<TContext>>;
  findOneResolver: ReturnType<TMakeFindOneResolverFn<TContext>>;
  countResolver: ReturnType<TMakeCountResolverFn<TContext>>;
  runResolver: ReturnType<TMakeRunResolverFn<TContext>>;
  loaderResolver: ReturnType<TMakeLoaderResolverFn<TModelType, TContext>>;
  resolveReferenceLoader: ReturnType<TMakeResolveReferenceLoaderFn<TContext>>;
  resolveEntityType: ReturnType<TMakeResolveEntityTypeFn<TContext>>;
  // muatations
  createOneResolver: ReturnType<TMakeCreateOneResolverFn<TContext>>;
  updateOneResolver: ReturnType<TMakeUpdateOneResolverFn<TContext>>;
  deleteOneResolver: ReturnType<TMakeDeleteOneResolverFn<TContext>>;
  restoreDeletedOneResolver: ReturnType<
    TMakeRestoreDeletedOneResolverFn<TContext>
  >;
  buildErrorMessage: typeof buildErrorMessage;
  testValidationError: typeof testValidationError;
  runOffsetLimitPaginationQuery: typeof runOffsetLimitPaginationQuery;
};

type CreateSchemaCallback<
  TContext extends TResolverContext = any,
  TFetchTags = any,
  TModels = any,
  TSchemaContext = any,
  TModelType = any
> = (
  options: CreateSchemaCallbackParams<
    TContext,
    TFetchTags,
    TModels,
    TSchemaContext,
    TModelType
  >
) => TSchemaModule<TContext>;

type TCreateSchemaOptions<
  TContext extends TResolverContext,
  TFetchTags = any,
  TModels = any,
  TSchemaContext = any
> = {
  fetchTags: TFetchTags;
  models: TModels;
  schemaContext: TSchemaContext;
  authValidations: TAuthValidations<TContext>;
};

export const makeSchemaCreator = <
  TContext extends TResolverContext,
  TFetchTags = any,
  TModels = any,
  TSchemaContext = any
>({
  fetchTags,
  models,
  schemaContext,
  authValidations,
}: TCreateSchemaOptions<TContext, TFetchTags, TModels, TSchemaContext>) => {
  // DEFINE RESOLVERS
  // common
  const fetch = createFetchMethods(fetchTags);

  const resolveReferenceLoader = makeResolveReferenceLoaderFn(authValidations);
  const resolveEntityType = makeResolveEntityTypeFn() as any;

  // mutations
  return function createSchema<TModelType = any>(
    modelName: keyof TModels,
    callbackFn: CreateSchemaCallback<
      TContext,
      TFetchTags,
      TModels,
      TSchemaContext,
      TModelType
    >
  ) {
    return callbackFn({
      // for typeDefs
      gql,
      // for common resolvers
      ...createPermissions(authValidations),
      fetch,
      // for queries
      relayStylePaginationResolver: makeRelayStylePaginationResolverFn(
        modelName,
        authValidations
      ),
      offsetLimitPaginationResolver: makeOffsetLimitPaginationResolverFn(
        modelName,
        authValidations
      ),
      findAllResolver: makeFindAllResolverFn(modelName, authValidations),
      findByIdResolver: makeFindByIdResolverFn(modelName, authValidations),
      findOneResolver: makeFindOneResolverFn(modelName, authValidations),
      countResolver: makeCountResolverFn(modelName, authValidations),
      runResolver: makeRunResolverFn(authValidations),
      loaderResolver: makeLoaderResolverFn(authValidations),
      resolveReferenceLoader,
      resolveEntityType,
      // for mutations
      createOneResolver: makeCreateOneResolverFn(modelName, authValidations),
      updateOneResolver: makeUpdateOneResolverFn(modelName, authValidations),
      deleteOneResolver: makeDeleteOneResolverFn(modelName, authValidations),
      restoreDeletedOneResolver: makeRestoreDeletedOneResolverFn(
        modelName,
        authValidations
      ),
      // for other contexts
      ...schemaContext,
      buildErrorMessage,
      testValidationError,
      runOffsetLimitPaginationQuery,
      models,
    });
  };
};

import type { DocumentNode, GraphQLResolveInfo } from 'graphql';
import type { Model } from 'mongoose';

export type TResolverContext = {
  dataSources: {
    models: Record<string, Model<any>>;
    [key: string]: any;
  };
  [key: string]: any;
};

export type TResolverFn<
  TContext extends TResolverContext = any,
  TArgs extends object = any,
  TSource extends object = any,
> = (source: TSource, args: TArgs, context: TContext, info: GraphQLResolveInfo) => Promise<any>;

export type TSchemaModule<TContext extends TResolverContext = any> = {
  typeDefs: DocumentNode;
  resolvers?: {
    Query?: Record<string, TResolverFn<TContext>>;
    Mutation?: Record<string, TResolverFn<TContext>>;
    [key: string]: Record<string, TResolverFn<TContext>> | undefined;
  };
};

export type TPageInfo = {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type TPageArgs = {
  page: number;
  limit: number;
  sort?: Record<string, 'asc' | 'desc'>;
};

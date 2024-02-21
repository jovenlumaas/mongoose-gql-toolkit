import getBaseResolver, {
  TAuthValidatorOptions,
} from "../common/getBaseResolver";

import type { Model } from "mongoose";
import type { TAuthValidations } from "../common";
import type { TResolverFn, TResolverContext } from "../../../../types";

// ************************************** For makeFindByPkResolverFn ****************************** //

export type TMakeFindByIdResolverFn<
  TContext extends TResolverContext = any,
  TDataSources extends Pick<TContext, "dataSources">["dataSources"] = Pick<
    TContext,
    "dataSources"
  >["dataSources"],
  TModels extends Pick<TDataSources, "models">["models"] = Pick<
    TDataSources,
    "models"
  >["models"]
> = (
  model: keyof TModels,
  authValidations: TAuthValidations
) => (key?: string, options?: TAuthValidatorOptions) => TResolverFn<TContext>;

export const makeFindByIdResolverFn: TMakeFindByIdResolverFn<any> =
  (model, authValidations) =>
  (key = "_id", options) => {
    const baseResolver = getBaseResolver({
      ...(options as TAuthValidatorOptions),
      authValidations,
    });

    return baseResolver.createResolver(
      async (_, args, { dataSources: { models } }) => {
        const primarykey = args[key];

        try {
          return await (models[model] as Model<any>)
            .findById(primarykey)
            .lean()
            .exec();
        } catch (error) {
          throw new Error(error.message);
        }
      }
    ) as any;
  };

// ************************************** For makeFindOneResolverFn ****************************** //

export type TMakeFindOneResolverFn<
  TContext extends TResolverContext = any,
  TDataSources extends Pick<TContext, "dataSources">["dataSources"] = Pick<
    TContext,
    "dataSources"
  >["dataSources"],
  TModels extends Pick<TDataSources, "models">["models"] = Pick<
    TDataSources,
    "models"
  >["models"]
> = (
  model: keyof TModels,
  authValidations: TAuthValidations
) => (options?: TAuthValidatorOptions) => TResolverFn<TContext>;

export const makeFindOneResolverFn: TMakeFindOneResolverFn<any> =
  (model, authValidations) => (options) => {
    const baseResolver = getBaseResolver({
      ...(options as TAuthValidatorOptions),
      authValidations,
    });

    return baseResolver.createResolver(
      async (_, { input }, { dataSources: { models } }) => {
        try {
          return await (models[model] as Model<any>)
            .findOne(input)
            .lean()
            .exec();
        } catch (error) {
          throw new Error(error.message);
        }
      }
    ) as any;
  };

import getBaseResolver, {
  TAuthValidatorOptions,
} from "../common/getBaseResolver";

// ************************************** For makeRunResolverFn ****************************** //

import type { TAuthValidations } from "../common";
import type { TResolverFn, TResolverContext } from "../../../../types";

// ************************************** For makeLoaderResolverFn ****************************** //

export type TMakeLoaderResolverFn<
  TModelType = any,
  TContext extends TResolverContext = any,
  TDataSources extends Pick<TContext, "dataSources">["dataSources"] = Pick<
    TContext,
    "dataSources"
  >["dataSources"],
  TLoaders extends Pick<TDataSources, "loaders">["loaders"] = Pick<
    TDataSources,
    "loaders"
  >["loaders"]
> = (authValidations: TAuthValidations) => <TSource>(
  /**
   * The name of the loader resolver that is pre-defined in the loaders folder.
   */
  loader: keyof TLoaders,
  /**
   * A LOCAL KEY that is linked to other records key (as foreign key).
   */
  foreignKey?: TSource extends object ? keyof TSource : keyof TModelType,
  options?: TAuthValidatorOptions
) => TResolverFn<TContext>;

export const makeLoaderResolverFn: TMakeLoaderResolverFn<any> =
  (authValidations) => (loader, foreignKey, options) => {
    try {
      const baseResolver = getBaseResolver({
        ...(options as TAuthValidatorOptions),
        authValidations,
      });

      return baseResolver.createResolver(
        async (parent, __, { dataSources: { loaders } }) => {
          const key = parent[foreignKey as any];
          const loaderInstance = loaders[loader];
          try {
            if (key && loaderInstance) return await loaderInstance.load(key);
            return null;
          } catch (err) {
            loaderInstance.clear(key);
            throw err;
          }
        }
      ) as any;
    } catch (err) {
      throw err;
    }
  };

// ************************************** For makeResolveReferenceLoaderFn ****************************** //

export type TMakeResolveReferenceLoaderFn<
  TContext extends TResolverContext = any
> = (
  authValidations: TAuthValidations
) => (
  loader: string,
  foreignKey?: string,
  options?: TAuthValidatorOptions
) => TResolverFn<TContext>;

export const makeResolveReferenceLoaderFn: TMakeResolveReferenceLoaderFn<any> =
  (authValidations) =>
  (loader, foreignKey = "", options) => {
    try {
      const baseResolver = getBaseResolver({
        ...(options as TAuthValidatorOptions),
        authValidations,
      });

      return baseResolver.createResolver(
        async (parent, { dataSources: { loaders } }) => {
          const key = parent[foreignKey];
          const loaderInstance = loaders[loader];
          try {
            if (key && loaderInstance) return await loaderInstance.load(key);
            return null;
          } catch (err) {
            loaderInstance.clear(key);
            throw err;
          }
        }
      ) as any;
    } catch (err) {
      throw err;
    }
  };

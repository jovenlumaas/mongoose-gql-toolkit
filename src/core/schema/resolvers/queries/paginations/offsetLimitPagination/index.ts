import getBaseResolver, {
  TAuthValidatorOptions,
} from "../../../common/getBaseResolver";

import runOffsetLimitPaginationQuery from "./runOffsetLimitPaginationQuery";

// types
import type { TResolverFn, TResolverContext } from "../../../../../../types";
import type { TAuthValidations } from "../../../common";

export { default as runOffsetLimitPaginationQuery } from "./runOffsetLimitPaginationQuery";

export type TMakeOffsetLimitPaginationResolverFn<
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

export const makeOffsetLimitPaginationResolverFn: TMakeOffsetLimitPaginationResolverFn<
  any
> = (model, authValidations) => (options) => {
  let baseResolver = getBaseResolver({
    ...(options as TAuthValidatorOptions),
    authValidations,
  });
  return baseResolver.createResolver(
    async (_, { filters = {}, pageArgs }, { dataSources: { models } }) => {
      const { fields, ops } = filters;

      const query = models[model].find({ ...fields, ...ops });

      return await runOffsetLimitPaginationQuery(query, { pageArgs });
    }
  ) as any;
};

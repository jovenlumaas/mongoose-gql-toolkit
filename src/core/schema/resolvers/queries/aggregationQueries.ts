import getBaseResolver, {
  TAuthValidatorOptions,
} from "../common/getBaseResolver";

import type { TAuthValidations } from "../common";
import type { TResolverFn, TResolverContext } from "../../../../types";
import type { FilterQuery, QueryOptions } from "mongoose";

// ************************************** For makeCountResolverFn ****************************** //

type TMakeCountOptions<TDocument = any> = TAuthValidatorOptions & {
  where?: FilterQuery<TDocument>;
  qryOpts?: QueryOptions<TDocument>;
};

export type TMakeCountResolverFn<
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
) => <TDocument = any>(
  options?: TMakeCountOptions<TDocument>
) => TResolverFn<TContext>;

export const makeCountResolverFn: TMakeCountResolverFn =
  (model, authValidations) => (options) => {
    const { where, qryOpts, ...authOptions } = options ?? {};

    let baseResolver = getBaseResolver({
      ...(authOptions as TAuthValidatorOptions),
      authValidations,
    });

    return baseResolver.createResolver(
      async (_, args, { dataSources: { models } }) => {
        // info.cacheControl.setCacheHint({ maxAge: 60, scope: "PRIVATE" });
        return await models[model].countDocuments(
          { ...args, ...where },
          qryOpts
        );
      }
    ) as any;
  };

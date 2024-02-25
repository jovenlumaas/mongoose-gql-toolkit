import getBaseResolver, {
  TAuthValidatorOptions,
} from "../common/getBaseResolver";

import type { TAuthValidations } from "../common";
import type { TResolverFn, TResolverContext } from "../../../../types";

type TUpdateOptions = TAuthValidatorOptions & {
  isBoolean?: boolean;
  manualSaveKeys?: string[];
};

// ************************************** For makeUpdateOneResolverFn ****************************** //

export type TMakeUpdateOneResolverFn<
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
) => (options?: TUpdateOptions) => TResolverFn<TContext>;

export const makeUpdateOneResolverFn: TMakeUpdateOneResolverFn<any> =
  (model, authValidations) => (options) => {
    const {
      isBoolean = false,
      manualSaveKeys = [],
      ...authOptions
    } = ({} = options ?? {});

    let baseResolver = getBaseResolver({
      ...(authOptions as TAuthValidatorOptions),
      authValidations,
    });

    return baseResolver.createResolver(
      async (_, { _id, input }, { dataSources: { models } }) => {
        try {
          const instance = models[model];
          let result: any = null;

          if (isBoolean) {
            result = await instance.updateOne({ _id }, input, {
              runValidators: true,
            });
          } else {
            result = await instance.findOneAndUpdate({ _id }, input, {
              runValidators: true,
              new: true,
              rawResult: true,
            });
          }

          // this is for Object type fields, we need to manually invoke markModified
          if (manualSaveKeys.length > 0) {
            manualSaveKeys.forEach((key) => {
              if (input?.[key]) instance.markModified(key);
            });
          }

          const res = isBoolean ? result?.acknowledged : result?.value;
          return res;
        } catch (err) {
          throw new Error(err.message);
        }
      }
    ) as any;
  };

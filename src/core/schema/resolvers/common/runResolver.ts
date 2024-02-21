import getBaseResolver, {
  TAuthValidatorOptions,
} from "../common/getBaseResolver";

// types
import type { TAuthValidations } from "../common";
import type { TResolverFn, TResolverContext } from "../../../../types";

type TOptions = TAuthValidatorOptions & { isBoolean?: boolean };

export type TMakeRunResolverFn<TContext extends TResolverContext = any> = (
  authValidations: TAuthValidations
) => <TArgs extends object = any, TSource extends object = any>(
  resolver: TResolverFn<TContext, TArgs, TSource>,
  options?: TOptions
) => TResolverFn<TContext>;

export const makeRunResolverFn: TMakeRunResolverFn<any> =
  (authValidations) => (resolver, options) => {
    const { isBoolean = false, ...authOptions } = options ?? {};

    const baseResolver = getBaseResolver({
      ...(authOptions as TAuthValidatorOptions),
      authValidations,
    });

    return baseResolver.createResolver(async (parent, args, context, info) => {
      try {
        const result: any = await resolver(parent, args, context, info);
        if (result) {
          if (isBoolean) {
            return true;
          } else {
            return result;
          }
        } else {
          return false;
        }
      } catch (error) {
        throw new Error(error.message);
      }
    }) as any;
  };

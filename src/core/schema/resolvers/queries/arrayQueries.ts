import getBaseResolver, { TAuthValidatorOptions } from '../common/getBaseResolver';

// types
import type { Model, SortValues } from 'mongoose';
import type { TResolverFn, TResolverContext } from '../../../../types';
import type { TAuthValidations } from '../common';

type TFindOptions = TAuthValidatorOptions & {
  sort?: Record<string, SortValues>;
};

// ************************************** For makeFindAllResolverFn ****************************** //

export type TMakeFindAllResolverFn<
  TContext extends TResolverContext = any,
  TDataSources extends Pick<TContext, 'dataSources'>['dataSources'] = Pick<TContext, 'dataSources'>['dataSources'],
  TModels extends Pick<TDataSources, 'models'>['models'] = Pick<TDataSources, 'models'>['models'],
> = (model: keyof TModels, authValidations: TAuthValidations) => (options?: TFindOptions) => TResolverFn<TContext>;

export const makeFindAllResolverFn: TMakeFindAllResolverFn<any> = (model, authValidations) => (options) => {
  const { sort = {}, ...authOptions } = options ?? {};

  const baseResolver = getBaseResolver({
    ...(authOptions as TAuthValidatorOptions),
    authValidations,
  });

  return baseResolver.createResolver(async (_, { input = {} }, { dataSources: { models } }, info) => {
    // info.cacheControl.setCacheHint({ maxAge: 60, scope: "PRIVATE" });
    try {
      return await (models[model] as Model<any>).find(input).sort(sort).exec();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }) as any;
};

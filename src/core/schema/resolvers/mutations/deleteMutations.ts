import getBaseResolver, { TAuthValidatorOptions } from '../common/getBaseResolver';

import type { TResolverFn, TResolverContext } from '../../../../types';
import type { TAuthValidations } from '../common';

// ************************************** For makeDeleteOneResolverFn ****************************** //

export type TMakeDeleteOneResolverFn<
  TContext extends TResolverContext = any,
  TDataSources extends Pick<TContext, 'dataSources'>['dataSources'] = Pick<TContext, 'dataSources'>['dataSources'],
  TModels extends Pick<TDataSources, 'models'>['models'] = Pick<TDataSources, 'models'>['models'],
> = (
  model: keyof TModels,
  authValidations: TAuthValidations,
) => (options?: TAuthValidatorOptions) => TResolverFn<TContext>;

export const makeDeleteOneResolverFn: TMakeDeleteOneResolverFn<any> = (model, authValidations) => (options) => {
  const baseResolver = getBaseResolver({
    ...(options as TAuthValidatorOptions),
    authValidations,
  });

  return baseResolver.createResolver(async (_, { _id }, { dataSources: { models } }) => {
    try {
      const result = await models[model].deleteOne({ _id }).exec();
      return result.acknowledged;
    } catch (error) {
      throw new Error(error);
    }
  }) as any;
};

// ************************************** For makeRestoreDeletedOneResolverFn ****************************** //

export type TMakeRestoreDeletedOneResolverFn<
  TContext extends TResolverContext = any,
  TDataSources extends Pick<TContext, 'dataSources'>['dataSources'] = Pick<TContext, 'dataSources'>['dataSources'],
  TModels extends Pick<TDataSources, 'models'>['models'] = Pick<TDataSources, 'models'>['models'],
> = (
  model: keyof TModels,
  authValidations: TAuthValidations,
) => (options?: TAuthValidatorOptions) => TResolverFn<TContext>;

export const makeRestoreDeletedOneResolverFn: TMakeRestoreDeletedOneResolverFn<any> =
  (model, authValidations) => (options) => {
    const baseResolver = getBaseResolver({
      ...(options as TAuthValidatorOptions),
      authValidations,
    });

    return baseResolver.createResolver(async (_, { id }, { dataSources: { models, sequelize } }) => {
      try {
        return await sequelize.transaction(async (t: any) => {
          return await models[model].restore({
            where: { id },
            transaction: t,
          });
        });
      } catch (error) {
        throw new Error(error);
      }
    }) as any;
  };

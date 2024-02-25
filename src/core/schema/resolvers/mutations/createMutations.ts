import getBaseResolver, { TAuthValidatorOptions } from '../common/getBaseResolver';
import { testValidationError } from '../common';

// types
import type { Model } from 'mongoose';
import type { TResolverFn, TResolverContext } from '../../../../types';
import type { TAuthValidations } from '../common';

type TCreateOption = TAuthValidatorOptions & {
  responseType?: 'Boolean' | 'Payload';
};

// ************************************** For makeCreateOneResolverFn ****************************** //

export type TMakeCreateOneResolverFn<
  TContext extends TResolverContext = any,
  TDataSources extends Pick<TContext, 'dataSources'>['dataSources'] = Pick<TContext, 'dataSources'>['dataSources'],
  TModels extends Pick<TDataSources, 'models'>['models'] = Pick<TDataSources, 'models'>['models'],
> = (model: keyof TModels, authValidations: TAuthValidations) => (options?: TCreateOption) => TResolverFn<TContext>;

export const makeCreateOneResolverFn: TMakeCreateOneResolverFn<any> = (model, authValidations) => (options) => {
  const { responseType = 'Payload', ...authOptions } = options ?? {};

  const baseResolver = getBaseResolver({
    ...(authOptions as TAuthValidatorOptions),
    authValidations,
  });

  return baseResolver.createResolver(async (_, { input }, { dataSources: { models, mongoose } }) => {
    const result = await (models[model] as Model<any>).create(input);

    testValidationError(result.validateSync());

    await result.save();

    return responseType === 'Boolean' ? true : result;
  }) as any;
};

// types
import type { Query } from 'mongoose';
import type { TPageArgs } from '../../../../../../types';

export default async function runOffsetLimitPaginationQuery<TQuery extends Query<any, any>>(
  query: TQuery,
  options: {
    pageArgs: TPageArgs;
  },
) {
  const { page, limit, sort } = options.pageArgs;

  const skip = limit * (page - 1);

  const totalCount = await query.clone().countDocuments().lean().exec();

  query.limit(limit).skip(skip);
  if (sort) query.sort(sort);

  const edges = await query.lean().exec();

  const totalPages = totalCount ? Math.ceil(Number(totalCount) / limit) : 0;
  const hasPreviousPage = totalCount >= limit && page > 1;
  const hasNextPage = totalCount >= limit && totalPages > page;

  return {
    edges,
    pageInfo: {
      page,
      limit,
      totalCount,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    },
    metaData: {},
  };
}

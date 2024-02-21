import { parseCursorMetaData } from './__core';
// types
import type { TPageQueryResult, TPageResult } from '../__types';

export default function lastRelayResult({
  lists,
  direction,
  last,
}: Pick<TPageQueryResult, 'lists' | 'direction' | 'last'>) {
  let nodes: any[] = [];
  let cursorMeta = {
    startCursor: '',
    endCursor: '',
    totalCount: 0,
  };

  const hasPreviousPage = lists.length > last;

  if (lists.length > 0) {
    if (direction === 'ltr') {
      // remove last item (which is just for determining if has previous page) since
      // in sql execution the LIMIT param is increased by 1
      // slice only the remainder
      const { total_count } = lists[0];
      const remainder = total_count % last;
      if (hasPreviousPage) {
        nodes = lists.slice(0, remainder === 0 ? -1 : remainder).reverse();
      } else {
        nodes = lists.reverse();
      }
    } else {
      nodes = hasPreviousPage ? lists.slice(0, -1).reverse() : lists.reverse();
    }

    // parse cursor meta data
    cursorMeta = parseCursorMetaData(nodes);
  }

  const result: TPageResult = {
    nodes,
    totalCount: cursorMeta.totalCount,
    pageInfo: {
      startCursor: cursorMeta.startCursor,
      endCursor: cursorMeta.endCursor,
      hasPreviousPage,
      hasNextPage: false,
    },
  };

  return result;
}

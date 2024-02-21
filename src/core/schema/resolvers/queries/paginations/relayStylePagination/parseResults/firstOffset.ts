import { parseCursorMetaData } from './__core';

// types
import type { TPageQueryResult, TPageResult } from '../__types';

export default function firstOffsetRelayResult({
  lists,
  first,
  offset,
  direction,
}: Pick<TPageQueryResult, 'lists' | 'first' | 'offset' | 'direction'>) {
  let nodes: any[] = [];
  let cursorMeta = {
    startCursor: '',
    endCursor: '',
    totalCount: 0,
  };

  let hasPreviousPage = false;
  const hasNextPage = lists.length > first;

  if (lists.length > 0) {
    if (direction === 'rtl') {
      const { total_count, offset_start } = lists[0] as any;
      hasPreviousPage = offset_start > 0; // total_count > offset && offset >= first;

      if (offset < first) {
        // remove first item (which is just for determining if has previous page) since
        // in sql execution the LIMIT param is increased by 1
        // slice only the remainder
        const remainder = total_count % first;
        if (offset <= remainder) {
          nodes = lists.slice(0, remainder === 0 ? -1 : remainder);
        } else {
          nodes = hasNextPage ? lists.slice(0, -1) : lists;
        }
      } else {
        nodes = hasNextPage ? lists.slice(0, -1) : lists;
      }
    } else {
      // remove first item (which is just for determining if has next page) since
      // in sql execution the LIMIT param is increased by 1
      nodes = hasNextPage ? lists.slice(0, -1) : lists;
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
      hasNextPage,
    },
  };

  return result;
}

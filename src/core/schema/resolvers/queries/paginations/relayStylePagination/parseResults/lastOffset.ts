import { parseCursorMetaData } from "./__core";
// types
import type { TPageQueryResult, TPageResult } from "../__types";

export default function lastOffsetRelayResult({
  lists,
  last,
}: Pick<TPageQueryResult, "lists" | "last">) {
  let nodes: any[] = [];
  let cursorMeta = {
    startCursor: "",
    endCursor: "",
    totalCount: 0,
  };

  const hasPreviousPage = lists.length > last;

  if (lists.length > 0) {
    // remove last item (which is just for determining if has previous page) since
    // in sql execution the LIMIT param is increased by 1
    // slice only the remainder
    nodes = hasPreviousPage ? lists.slice(0, -1).reverse() : lists.reverse();

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

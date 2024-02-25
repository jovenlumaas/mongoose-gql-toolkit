import { parseCursorMetaData } from "./__core";
// types
import type { TPageQueryResult, TPageResult } from "../__types";

export default function firstRelayResult({
  lists,
  direction,
  first,
}: Pick<TPageQueryResult, "lists" | "direction" | "first">) {
  let nodes: any[] = [];
  let cursorMeta = {
    startCursor: "",
    endCursor: "",
    totalCount: 0,
  };

  const hasNextPage = lists.length > first;

  if (lists.length > 0) {
    if (direction === "rtl") {
      // remove first item (which is just for determining if has previous page) since
      // in sql execution the LIMIT param is increased by 1
      // slice only the remainder
      const { total_count } = lists[0];
      const remainder = total_count % first;
      nodes = lists.slice(0, remainder === 0 ? -1 : remainder);
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
      hasPreviousPage: false,
      hasNextPage,
    },
  };

  return result;
}

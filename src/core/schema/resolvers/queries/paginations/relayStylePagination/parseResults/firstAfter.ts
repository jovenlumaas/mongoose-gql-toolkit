import { parseCursorMetaData } from "./__core";
// types
import type { TPageQueryResult, TPageResult } from "../__types";

export default function firstAfterRelayResult({
  lists,
  first,
}: Pick<TPageQueryResult, "lists" | "first">) {
  let nodes: any[] = [];
  let cursorMeta = {
    startCursor: "",
    endCursor: "",
    totalCount: 0,
  };

  let hasPreviousPage = false;
  const hasNextPage = lists.length > first;

  if (lists.length > 0) {
    // remove first item (which is just for determining if has next page) since
    // in sql execution the LIMIT param is increased by 1
    nodes = hasNextPage ? lists.slice(0, -1) : lists;

    // parse cursor meta data
    cursorMeta = parseCursorMetaData(nodes);

    // validate hasPreviousPage
    const { prev_page_count = "0" } = nodes[0];
    const prevPageCount = parseInt(prev_page_count, prev_page_count);
    hasPreviousPage = !isNaN(prevPageCount) && prevPageCount > 0;
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

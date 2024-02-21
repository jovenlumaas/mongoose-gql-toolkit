// ************************** For ParseResult **************************************** //
export type TEdgeArgs = any;
export type TPageNode = {
  id: string;
  createdAt: string;
  total_count: number;
};

export type TPageQueryResult = TEdgeArgs & {
  lists: TPageNode[];
};

export type TPageInfo = {
  startCursor: string;
  endCursor: string;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type TPageResult = {
  nodes: TPageNode[];
  totalCount: number;
  pageInfo: TPageInfo;
};

// ************************** For ParseSQL **************************************** //
export type TCommonClauseParams = {
  limit: number;
  createdAt?: string;
};

export type TParseSQLParams = {
  tbl: string;
  selections: string;
  orderBy: string;
  whereStr: string;
};

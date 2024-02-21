import { encrypt } from '../../../../../../../utils';
// types
import type { TPageNode } from '../__types';

export const parseCursorMetaData = (nodes: TPageNode[]) => {
  let startCursor = '';
  let endCursor = '';
  let totalCount = 0;

  if (nodes.length > 0) {
    // for startCursor and totalCount
    const { id: startId, createdAt: startCreatedAt, total_count } = nodes[0];

    startCursor = encrypt(JSON.stringify({ id: startId, createdAt: startCreatedAt }));
    totalCount = total_count;

    // for endCursor
    let lastRecord = null;

    if (nodes.length > 1) {
      lastRecord = nodes[nodes.length - 1];
    } else {
      lastRecord = nodes[0];
    }

    const { id: endId, createdAt: endCreatedAt } = lastRecord;
    endCursor = encrypt(JSON.stringify({ id: endId, createdAt: endCreatedAt }));
  }

  return { startCursor, endCursor, totalCount };
};

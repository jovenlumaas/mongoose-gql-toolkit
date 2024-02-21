import gql from 'graphql-tag';
// types
import type { TSchemaModule } from '../../types';

export const commonInputTypeDefs: TSchemaModule = {
  typeDefs: gql`
    input RoutingInput {
      id: ID
      privacy: String
      status: String
      updatedBy: ID
      updateType: ButtonActionType
    }

    input DateRangeInput {
      rangeType: String
      dateField: String
      dateFrom: Date
      dateTo: Date
      excludeFields: [String]
      sortBy: String
      sortOrder: String
    }
  `,
};

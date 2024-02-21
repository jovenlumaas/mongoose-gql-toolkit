import gql from 'graphql-tag';
// types
import type { TSchemaModule } from '../../types';

export const commonEnumTypeDefs: TSchemaModule = {
  typeDefs: gql`
    enum ButtonActionType {
      submit
      resubmit
      approve
      reject
      custom
    }
  `,
};

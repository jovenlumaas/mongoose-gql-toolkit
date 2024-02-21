import type { TResolverFn, TResolverContext } from "../../../../types";

// ************************************** For makeResolveEntityTypeFn ****************************** //

export type TMakeResolveEntityTypeFn<TContext extends TResolverContext = any> =
  () => (options: {
    __typename: string;
    key?: string;
    foreignKey?: string;
  }) => TResolverFn<TContext>;

export const makeResolveEntityTypeFn =
  () =>
  ({ __typename = "", key = "id", foreignKey = "" }) => {
    return (parent: any) => {
      try {
        return { __typename, [key]: parent[foreignKey] };
      } catch (error) {
        throw new Error(error.message);
      }
    };
  };

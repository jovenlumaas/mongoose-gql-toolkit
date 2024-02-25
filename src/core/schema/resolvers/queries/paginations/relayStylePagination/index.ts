import getBaseResolver, {
  TAuthValidatorOptions,
} from "../../../common/getBaseResolver";

// dependencies
import {
  parseFirst,
  parseFirstAfter,
  parseFirstOffset,
  parseLast,
  parseLastBefore,
  parseLastOffset,
} from "./parseResults";
// types
import type { TAuthValidations } from "../../../common";
import type { TResolverFn, TResolverContext } from "../../../../../../types";
import type { TPageResult } from "./__types";

type TOptions = TAuthValidatorOptions & {
  dbTable: string;
};

export type TMakeRelayStylePaginationResolverFn<
  TContext extends TResolverContext = any,
  TDataSources extends Pick<TContext, "dataSources">["dataSources"] = Pick<
    TContext,
    "dataSources"
  >["dataSources"],
  TModels extends Pick<TDataSources, "models">["models"] = Pick<
    TDataSources,
    "models"
  >["models"]
> = (
  model: keyof TModels,
  authValidations: TAuthValidations
) => (options?: TOptions) => TResolverFn<TContext>;

export const makeRelayStylePaginationResolverFn: TMakeRelayStylePaginationResolverFn<
  any
> = (model, authValidations) => (options) => {
  let baseResolver = getBaseResolver({
    ...(options as TAuthValidatorOptions),
    authValidations,
  });

  return baseResolver.createResolver(
    async (_, { input, edgeArgs }, { dataSources: { sequelize } }) => {
      try {
        // const lists = await sequelize.transaction(async (t: any) => {
        //   return await sequelize.query(sql, {
        //     type: QueryTypes.SELECT,
        //     transaction: t,
        //   });
        // });

        const lists: any[] = [];

        // create a shape of response
        const { edgeArgs } = input;
        const { first, after, last, before, offset, direction } = edgeArgs;

        let pageResult: TPageResult = {
          nodes: [],
          totalCount: 0,
          pageInfo: {
            startCursor: "",
            endCursor: "",
            hasPreviousPage: false,
            hasNextPage: false,
          },
        };

        console.log("\n\nEDGEARGS::", edgeArgs);

        const isOffSet = typeof offset === "number" && offset >= 0;

        if (isOffSet && first) {
          // && !after && !last && !before
          // for direction 'ltr'
          pageResult = parseFirstOffset({
            lists,
            first,
            offset,
            direction,
          });
        } else if (isOffSet && last && !after && !first && !before) {
          // for direction 'rtl'
          pageResult = parseLastOffset({ lists, last });
        } else if (isOffSet === false && first && !after && !last && !before) {
          // for first page
          pageResult = parseFirst({ lists, direction, first });
        } else if (!isOffSet && first && after && !last && !before) {
          // for forward
          pageResult = parseFirstAfter({ lists, first });
        } else if (!isOffSet && last && !before && !first && !after) {
          // for last page
          pageResult = parseLast({ lists, direction, last });
        } else if (!isOffSet && last && before && !first && !after) {
          // for backward
          pageResult = parseLastBefore({ lists, last });
        } else {
          console.log("\n\nNO MATCH:::\n\n");
        }

        const edges = pageResult.nodes.map(
          ({ total_count, prev_page_count, next_page_count, ...node }: any) => {
            return {
              // cursor: encrypt(JSON.stringify({ id, createdAt })), // <--- REMOVED to save bandwidth
              node: { __typename: model, ...node },
            };
          }
        );

        return { ...pageResult, edges };
      } catch (err) {
        throw new Error(err);
      }
    }
  ) as any;
};

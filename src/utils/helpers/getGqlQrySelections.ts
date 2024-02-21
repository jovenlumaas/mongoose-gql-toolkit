import { GraphQLResolveInfo } from "graphql";

export default function getGqlQrySelections({
  fieldNodes,
}: GraphQLResolveInfo) {
  return fieldNodes
    .map((node) => node.selectionSet?.selections)
    .flat()
    .map((s: any) => s.name.value)
    .join(" ");
}

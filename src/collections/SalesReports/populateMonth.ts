import payload from "payload";
import { CollectionAfterReadHook } from "payload/types";

export const reportMonth: CollectionAfterReadHook = async ({
  context,
  doc,
}) => {
  if (context.skipTrigger) return;
};

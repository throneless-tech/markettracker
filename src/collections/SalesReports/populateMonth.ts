import payload from "payload";
import { CollectionAfterReadHook } from "payload/types";

export const reportMonth: CollectionAfterReadHook = async ({
  context,
  doc,
}) => {
  if (context.skipTrigger) return;
  const reportDate = new Date(doc.day);
  const month = reportDate
    .toLocaleString("default", { month: "long" })
    .toLowerCase();

  return {
    ...doc,
    month,
  };
};

import payload from "payload";
import { CollectionAfterReadHook } from "payload/types";

export const afterReadStats: CollectionAfterReadHook = async ({
  context,
  doc, // full document data
}) => {
  if (context.skipTrigger) return;

  const applications = await payload.find({
    collection: "applications",
    depth: 0,
    where: {
      and: [{ vendor: { equals: doc.id } }, { status: { equals: "approved" } }],
    },
    context: { skipTrigger: true },
  });

  return {
    ...doc,
    numberOfMarkets: Array.isArray(applications.docs)
      ? applications.docs?.length
      : 0,
  };
};

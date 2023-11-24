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
      vendor: { equals: doc.id },
    },
    context: { skipTrigger: true },
  });

  return {
    ...doc,
    numberOfApplications: applications.docs?.length
      ? applications.docs.length
      : 0,
    numberOfMarkets: applications.docs?.length
      ? applications.docs.reduce((acc, app) => {
          if (app.status === "approved") acc += 1;
          return acc;
        }, 0)
      : 0,
  };
};

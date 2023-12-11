import payload from "payload";
import type { CollectionAfterReadHook } from "payload/types";

export const afterReadVendorsField: CollectionAfterReadHook = async (args) => {
  const {
    doc, // Typed as Season
    context,
  } = args;

  if (context.skipTrigger) return;

  const applications = await payload.find({
    collection: "applications",
    depth: 1,
    where: {
      and: [
        {
          status: {
            equals: "approved",
          },
        },
        {
          "season.id": {
            equals: doc.id,
          },
        },
      ],
    },
    limit: 9999,
    context: {
      skipTrigger: true,
    },
  });

  return applications.docs?.length
    ? {
        ...doc,
        vendors: applications.docs.map((application) => application.vendor),
      }
    : doc;
};

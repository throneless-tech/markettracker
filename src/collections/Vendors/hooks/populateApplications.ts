import payload from "payload";
import {
  CollectionAfterReadHook,
  CollectionBeforeValidateHook,
} from "payload/types";
import type { Application } from "payload/generated-types";

export const afterReadApplications: CollectionAfterReadHook = async ({
  context,
  doc, // full document data
}) => {
  if (context.skipTrigger) return;
  if (
    doc.applications &&
    doc.applications.length &&
    typeof doc.applications[0] === "string"
  ) {
    const applications = await payload.find({
      collection: "applications",
      depth: 1,
      where: { id: { in: doc.applications.join(",") } },
      context: { skipTrigger: true },
    });
    return { ...doc, applications: applications.docs };
    // } else if (!doc.applications || !doc.applications.length) {
  } else {
    const applications = await payload.find({
      collection: "applications",
      depth: 1,
      where: { vendor: { equals: doc.id } },
      context: { skipTrigger: true },
    });
    // console.log("***applications:", applications.docs);
    return { ...doc, applications: applications.docs };
  }
  // return doc;
};

export const beforeValidateApplications: CollectionBeforeValidateHook = async ({
  data,
}) => {
  if (
    data.applications &&
    data.applications.length &&
    typeof data.applications[0] === "object"
  ) {
    return {
      ...data,
      applications: data.applications.map((app: Application) => app.id),
    };
  }
};

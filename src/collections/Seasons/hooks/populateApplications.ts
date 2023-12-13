import payload from "payload";
import {
  CollectionAfterReadHook,
  CollectionBeforeValidateHook,
} from "payload/types";
import type { Application } from "payload/generated-types";

export const afterReadApplications: CollectionAfterReadHook = async ({
  doc, // full document data
}) => {
  if (
    doc.applications &&
    doc.applications.length &&
    typeof doc.applications[0] === "string"
  ) {
    const applications = await payload.find({
      collection: "applications",
      depth: 0,
      where: { id: { in: doc.applications.join(",") } },
    });
    return { ...doc, applications: applications.docs };
  }
  return doc;
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
      applications: data.applications.map((application: Application) => application.id),
    };
  }

  return data;
};

import payload from "payload";
import {
  CollectionAfterReadHook,
  CollectionBeforeValidateHook,
} from "payload/types";

export const afterReadApplication: CollectionAfterReadHook = async ({
  doc, // full document data
}) => {
  if (doc.application && typeof doc.application === "string") {
    const application = await payload.findByID({
      id: doc.application,
      collection: "applications",
      depth: 1,
    });
    return { ...doc, application: application };
  }
  return doc;
};

export const beforeValidateApplication: CollectionBeforeValidateHook = async ({
  data,
}) => {
  if (data.application && typeof data.application === "object") {
    return { ...data, application: data.application.id };
  }
};

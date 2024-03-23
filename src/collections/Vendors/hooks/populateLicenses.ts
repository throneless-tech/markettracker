import payload from "payload";
import {
  CollectionAfterReadHook,
  CollectionBeforeValidateHook,
} from "payload/types";
import type { License } from "payload/generated-types";

export const afterReadLicenses: CollectionAfterReadHook = async ({
  context,
  doc, // full document data
}) => {
  if (context.skipTrigger) return;
  if (
    doc.licenses &&
    doc.licenses.length &&
    typeof doc.licenses[0] === "string"
  ) {
    const licenses = await payload.find({
      collection: "licenses",
      depth: 0,
      where: { id: { in: doc.licenses.join(",") } },
    });
    return { ...doc, licenses: licenses.docs };
  }
  return doc;
};

export const beforeValidateLicenses: CollectionBeforeValidateHook = async ({
  data,
}) => {
  if (
    data.licenses &&
    data.licenses.length &&
    typeof data.licenses[0] === "object"
  ) {
    return {
      ...data,
      licenses: data.licenses.map((license: License) => license.id),
    };
  }
  return data;
};

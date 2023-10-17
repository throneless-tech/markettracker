import payload from "payload";
import {
  CollectionAfterReadHook,
  CollectionBeforeValidateHook,
} from "payload/types";

export const afterReadVendor: CollectionAfterReadHook = async ({
  doc, // full document data
}) => {
  if (doc.vendor && typeof doc.vendor === "string") {
    const vendor = await payload.find({
      collection: "vendors",
      depth: 1,
      limit: 1,
      where: { id: { equals: doc.vendor } },
    });
    return { ...doc, vendor: vendor.docs[0] };
  }
  return doc;
};

export const beforeValidateVendor: CollectionBeforeValidateHook = async ({
  data,
}) => {
  if (
    data.vendor && typeof data.vendor === "object"
  ) {
    return { ...data, vendor: data.vendor.id };
  }
  return data;
};

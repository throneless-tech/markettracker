import payload from "payload";
import {
  CollectionAfterReadHook,
  CollectionBeforeValidateHook,
} from "payload/types";

export const afterReadVendor: CollectionAfterReadHook = async ({
  doc, // full document data
}) => {
  if (doc.vendor && typeof doc.vendor === "string") {
    const vendor = await payload.findByID({
      id: doc.vendor,
      collection: "vendors",
      depth: 2,
    });
    return { ...doc, vendor: vendor };
  }
  return doc;
};

export const beforeValidateVendor: CollectionBeforeValidateHook = async ({
  data,
}) => {
  if (data.vendor && typeof data.vendor === "object") {
    return { ...data, vendor: data.vendor.id };
  }
  return data;
};

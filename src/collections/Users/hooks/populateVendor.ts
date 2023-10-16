import payload from "payload";
import {
  CollectionAfterReadHook,
  CollectionBeforeValidateHook,
} from "payload/types";

export const afterReadVendor: CollectionAfterReadHook = async ({
  doc, // full document data
}) => {
  console.log("doc:", doc);
  if (typeof doc.vendor === "string") {
    console.log("Fetching vendor");
    const vendor = await payload.findByID({
      collection: "vendors",
      id: doc.vendor,
      depth: 0,
    });
    return { ...doc, vendor };
  }
  return doc;
};

export const beforeValidateVendor: CollectionBeforeValidateHook = async ({
  data,
}) => {
  if (
    data.vendor && typeof data.vendor === "object"
  ) {
    const existing = await payload.findByID({
      collection: "seasons",
      id: data.vendor.id,
    });
    if (existing) {
      await payload.update({
        collection: "seasons",
        id: data.vendor.id,
        data: data.vendor,
      });
    } else {
      await payload.create({
        collection: "seasons",
        data: data.vendor,
      });
    }
    return { ...data, vendor: data.vendor.id };
  }
  return data;
};

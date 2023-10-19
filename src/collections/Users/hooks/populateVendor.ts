import payload from "payload";
import {
  CollectionAfterReadHook,
  CollectionBeforeValidateHook,
} from "payload/types";
import { Contact } from "payload/generated-types";

export const afterReadVendor: CollectionAfterReadHook = async ({
  doc, // full document data
}) => {
  if (typeof doc.vendor === "string") {
    const vendor = await payload.findByID({
      collection: "vendors",
      id: doc.vendor,
      depth: 0,
    });
    return {
      ...doc,
      vendor,
    };
  }
  return doc;
};

export const beforeValidateVendor: CollectionBeforeValidateHook = async ({
  data,
}) => {
  if (data.vendor && typeof data.vendor === "object") {
    let id = data.vendor.id;
    const existing = await payload.findByID({
      collection: "vendors",
      id,
    });
    if (existing) {
      await payload.update({
        collection: "vendors",
        id,
        data: data.vendor,
      });
    } else {
      ({ id } = await payload.create({
        collection: "vendors",
        data: data.vendor,
      }));
    }
    return { ...data, vendor: id };
  }
  return data;
};

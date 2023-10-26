import payload from "payload";
import {
  CollectionAfterReadHook,
  CollectionBeforeValidateHook,
} from "payload/types";

export const afterReadMarket: CollectionAfterReadHook = async ({
  doc, // full document data
}) => {
  if (doc.market && typeof doc.market === "string") {
    const market = await payload.findByID({
      id: doc.market,
      collection: "markets",
      depth: 0,
    });
    return { ...doc, market: market };
  }
  return doc;
};

export const beforeValidateMarket: CollectionBeforeValidateHook = async ({
  data,
}) => {
  if (data.market && typeof data.market === "object") {
    return { ...data, market: data.market.id };
  }

  return data;
};

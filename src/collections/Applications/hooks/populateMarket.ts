import payload from "payload";
import {
  CollectionAfterReadHook,
  CollectionBeforeValidateHook,
} from "payload/types";

export const afterReadMarket: CollectionAfterReadHook = async ({
  doc, // full document data
}) => {
  if (doc.season && typeof doc.season === "string") {
    const season = await payload.find({
      collection: "seasons",
      depth: 1,
      limit: 1,
      where: { id: { equals: doc.season } },
    });
    return { ...doc, season: season.docs[0] };
  }
  return doc;
};

export const beforeValidateMarket: CollectionBeforeValidateHook = async ({
  data,
}) => {
  if (
    data.season && typeof data.season === "object"
  ) {
    return { ...data, season: data.season.id };
  }
  return data;
};

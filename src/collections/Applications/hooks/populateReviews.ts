import payload from "payload";
import {
  CollectionAfterReadHook,
  CollectionBeforeValidateHook,
} from "payload/types";

export const afterReadReviews: CollectionAfterReadHook = async ({
  doc, // full document data
}) => {
  if (doc.reviews && typeof doc.reviews === "string") {
    const reviews = await payload.findByID({
      id: doc.reviews,
      collection: "reviews",
      depth: 2,
    });
    return { ...doc, reviews: reviews };
  }
  return doc;
};

export const beforeValidateReviews: CollectionBeforeValidateHook = async ({
  data,
}) => {
  if (data.reviews && typeof data.reviews === "object") {
    return { ...data, reviews: data.reviews.id };
  }
  return data;
};

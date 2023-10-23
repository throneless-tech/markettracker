import { CollectionBeforeChangeHook } from "payload/types";

export const createReviewedAt: CollectionBeforeChangeHook = async ({
  data,
  operation,
}) => {
  if (operation === "create") {
    data.reviewedAt = Date.now();
  }
  return data;
};

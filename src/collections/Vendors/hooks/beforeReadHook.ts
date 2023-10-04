import payload from "payload";
import type { CollectionBeforeReadHook } from "payload/types";

export const beforeReadHook: CollectionBeforeReadHook = async ({
  doc, // full document data
  req, // full express request
  query, // JSON formatted query
}) => {
  await payload.find({
    collection: "vendors",
    depth: 3,
    pagination: false,
  });
  return doc;
};
import payload from "payload";
import { CollectionAfterReadHook } from "payload/types";

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

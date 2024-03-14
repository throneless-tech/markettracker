import payload from "payload";
import {
  CollectionAfterReadHook,
  CollectionBeforeValidateHook,
} from "payload/types";
import type { MarketReport } from "payload/generated-types";

export const afterReadMarketReports: CollectionAfterReadHook = async ({
  doc, // full document data
}) => {
  if (
    doc.marketReports &&
    doc.marketReports.length &&
    typeof doc.marketReports[0] === "string"
  ) {
    const marketReports = await payload.find({
      collection: "market-reports",
      depth: 0,
      where: { id: { in: doc.marketReports.join(",") } },
    });
    return { ...doc, marketReports: marketReports.docs };
  }
  return doc;
};

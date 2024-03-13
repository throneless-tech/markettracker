import payload from "payload";
import {
  CollectionAfterReadHook,
  CollectionBeforeValidateHook,
} from "payload/types";
import type { SalesReport } from "payload/generated-types";

export const afterReadSalesReports: CollectionAfterReadHook = async ({
  context,
  doc, // full document data
}) => {
  if (context.skipTrigger) return;
  if (
    doc.salesReports &&
    doc.salesReports.length &&
    typeof doc.salesReports[0] === "string"
  ) {
    const salesReports = await payload.find({
      collection: "sales-reports",
      depth: 1,
      where: { id: { in: doc.salesReports.join(",") } },
      context: { skipTrigger: true },
    });
    return { ...doc, salesReports: salesReports.docs };
  } else if (!doc.salesReports || !doc.salesReports.length) {
    const salesReports = await payload.find({
      collection: "sales-reports",
      depth: 1,
      where: { vendor: { equals: doc.id } },
      context: { skipTrigger: true },
    });
    // console.log("***salesReports:", salesReports.docs);
    return { ...doc, salesReports: salesReports.docs };
  }
  return doc;
};

export const beforeValidateSalesReports: CollectionBeforeValidateHook = async ({
  data,
}) => {
  if (
    data.salesReports &&
    data.salesReports.length &&
    typeof data.salesReports[0] === "object"
  ) {
    return {
      ...data,
      salesReports: data.salesReports.map((report: SalesReport) => report.id),
    };
  }
};

import e from "express";
import type { SalesReport, Vendor, Application } from "payload/generated-types";

const monthlyInvoices = async (req, res, next) => {
  /**
   * This endpoint creates invoices
   * for vendors whose sales and coupons in a particular month
   * for a particular market for every date that they attended
   * has been completed
   */

  /**
   *
   * loop through every sales report for a particular month--
   * create a map where the key is vendor
   * and the value is all their sales reports
   */
  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  // invoices are run for the previous month
  const month = months[new Date().getMonth() - 1];

  let reports = await req.payload.find({
    collection: "sales-reports",
    where: {
      month: {
        equals: month,
      },
    },
    depth: 2,
  });

  console.log("**** reports", reports);

  const [completeMap, incompleteMap] = reports.docs.reduce(
    (acc, report) => {
      const [completed, incomplete] = acc;

      // if an invoice date exists
      // it's already been invoiced
      // don't do anything
      if (report.invoiceDate) {
        return [completed, incomplete];
      }

      // if a sales report has an empty cashAndCredit
      // (i.e. the vendor hasn't added it)
      // we add that sales report to a separate array
      if (report.cashAndCredit === null || report.cashAndCredit === undefined) {
        let existing = incomplete.get(report.vendor.id);
        // if it does, add the report to the vendor's values array
        if (existing) {
          existing.push(report);
        } else {
          incomplete.set(report.vendor.id, [report]);
        }
      } else {
        // check if the vendorMap has a key of this vendor's id
        let existing = completed.get(report.vendor.id);
        // if it does, add the report to the vendor's values array
        if (existing) {
          existing.push(report);
        } else {
          completed.set(report.vendor.id, [report]);
        }
      }

      /**  the below is looking through all of a vendor's
            //      * approved application for dates in the month of 
            //      * invoice generation,
            //      * we do this because the number of completed sales reports 
            //      * needs to be THE SAME
            //      * as the number of approved dates
            //      * before an invoice can be created
            //     */
      // let existingDates = marketDates.get(report.vendor.id);

      // const dates = report.vendor.applications.reduce((acc, app) => {
      //     if (app.status === 'approved' || app.status === "approvedWithEdits") {
      //         const thisMonth = app.dates.map(date => date.date).filter(date => months[new Date(date).getMonth()] === 'february')
      //         // filter the array for when
      //         return acc.concat(thisMonth)
      //     }
      //     return acc
      // }, []);

      // if (existingDates) {
      //     existingDates.concat(dates);
      // } else {
      //     marketDates.set(report.vendor.id, dates)
      // }

      return [completed, incomplete];
    },
    [new Map(), new Map()],
  );

  // only create invoices for vendors
  // who doesn't have an incomplete sales report
  const invoicesArray = [];

  try {
    // create invoices
    for (const [key, value] of Array.from(completeMap) as any) {
      // if the vendor has an incomplete sales report
      // don't create the invoice
      if (incompleteMap.has(key)) {
        return;
      }
      const invoice = await req.payload.create({
        collection: "invoices",
        data: {
          vendor: key,
          marketMonth: month,
          reports: value.map((report) => report.id),
        },
      });
      invoicesArray.push(invoice);
      for (const report of value) {
        const updated = await req.payload.update({
          collection: "sales-reports",
          id: report.id,
          data: {
            invoiceDate: new Date().toISOString(),
          },
        });
      }
    }
  } catch (err) {
    res.status(500).send({
      error: err.message,
    });
  }

  return res.status(201).send({
    invoices: invoicesArray,
  });
};
export { monthlyInvoices };

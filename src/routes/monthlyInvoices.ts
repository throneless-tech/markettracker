import type { SalesReport, Vendor, Application } from "payload/generated-types";

const monthlyInvoices = async (req, res, next) => {
  /**
   * This thing creates invoices
   * for vendors whose sales and coupons in a particular month
   * for a particular market for every date that they're signed up for
   * has been completed
   */

  /**
   * per vendor,
   * get every sales report in a month
   * get their application, get all the dates for that month?
   * and check if
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

  const month = months[new Date().getMonth()];

  let reports = await req.payload.find({
    collection: "sales-reports",
    where: {
      month: {
        equals: "february",
      },
    },
    depth: 2,
  });

  const vendorMaps = reports.docs.reduce(
    (acc, report) => {
      const [salesReports, marketDates] = acc;

      // if a sales report has an empty cashAndCredit
      // (i.e. the vendor hasn't added it)
      // we don't add that sales report to the array
      if (report.cashAndCredit === null || report.cashAndCredit === undefined) {
        return [salesReports, marketDates];
      }
      // check if the vendorMap has a key of this vendor's id
      let existing = salesReports.get(report.vendor.id);
      // if it does, add the report to the vendor's values array
      if (existing) {
        existing.push(report);
      } else {
        salesReports.set(report.vendor.id, [report]);
      }

      let existingDates = marketDates.get(report.vendor.id);

      if (existingDates) {
        const dates = report.vendor.applications.reduce((acc, app) => {
          acc.concat(app.dates);
        }, []);
        existingDates.concat(dates);
      } else {
        // TODO
      }

      return [salesReports, marketDates];
    },
    [new Map(), new Map()],
  );

  console.log("*** VENDOR MAP INNIT", vendorMaps);
  return res.status(200).send();
};

export { monthlyInvoices };

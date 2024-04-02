import type { SalesReport, Vendor, Application } from "payload/generated-types";
/**
 * This endpoint creates invoices
 * for vendors whose sales and coupons in a particular month
 * for a particular market for every date that they attended
 * has been completed
 */

const monthlyInvoices = async (req, res, next) => {
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
  const month = months[new Date().getMonth() - 2];

  let reports = await req.payload.find({
    collection: "sales-reports",
    where: {
      month: {
        equals: month,
      },
    },
    limit: 9999,
    depth: 2,
  });

  const [completeMap, incompleteMap] = reports.docs.reduce(
    (acc, report) => {
      const [completed, incomplete] = acc;

      // if an invoice date exists in a Sales Report
      // it's already been invoiced
      // we don't need to do anything
      if (report.invoiceDate) {
        return [completed, incomplete];
      }

      // if a sales report has an empty cashAndCredit property
      // (i.e. the vendor hasn't added it)
      // we add that sales report to a separate array called
      if (report.cashAndCredit === null || report.cashAndCredit === undefined) {
        // check if the vendorMap has a key of this vendor's id
        // if it does, add the report to the vendor's values array
        let existing = incomplete.get(report.vendor.id);
        if (existing) {
          existing.push(report);
        } else {
          incomplete.set(report.vendor.id, [report]);
        }
      } else {
        let existing = completed.get(report.vendor.id);
        if (existing) {
          existing.push(report);
        } else {
          completed.set(report.vendor.id, [report]);
        }
      }

      /** THIS IS COMMENTED OUT, WE CHOSE A DIFFERENT WAY  
             * the below is looking through all of a vendor's
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

  const invoicesArray = [];

  try {
    // create invoices
    // only create invoices for vendors
    // who doesn't have an incomplete sales report
    for (const [key, value] of Array.from(completeMap) as any) {
      // if the vendor has an incomplete sales report
      // don't create the invoice
      if (incompleteMap.has(key)) {
        return;
      }

      //  {
      //   season: "",
      //   marketDays: 0,
      //   cashAndCredit: 0,
      //   marketFees: 0,
      //   ebt: 0,
      //   snapBonus: 0,
      //   producePlus: 0,
      //   wic: 0,
      //   sfmnp: 0,
      //   fmnpBonus: 0,
      //   cardCoupon: 0,
      //   marketGoods: 0,
      //   gWorld: 0,
      //   total: 0,
      // }
      const [sales, penaltiesAndCredits] = value.reduce(
        ([acc, penaltiesAndCredits], report) => {
          let existing = acc.get(report.season.name);
          if (!existing) {
            existing = {
              season: report.season.name,
              marketDays: 0,
              cashAndCredit: 0,
              marketFee: 0,
              ebt: 0,
              snapBonus: 0,
              producePlus: 0,
              wic: 0,
              sfmnp: 0,
              fmnpBonus: 0,
              cardCoupon: 0,
              marketGoods: 0,
              gWorld: 0,
              total: 0,
            };
          }
          // console.log("***existing", existing);

          existing.marketDays += 1;
          existing.cashAndCredit += report.cashAndCredit ?? 0;
          existing.marketFee = report.marketFee ?? 0;
          existing.ebt += report.ebt ?? 0;
          existing.snapBonus += report.snapBonus ?? 0;
          existing.producePlus += report.producePlus ?? 0;
          existing.wic += report.wic ?? 0;
          existing.sfmnp += report.sfmnp ?? 0;
          existing.fmnpBonus += report.fmnpBonus ?? 0;
          existing.cardCoupon += report.cardCoupon ?? 0;
          existing.marketGoods += report.marketGoods ?? 0;
          existing.gWorld += report.gWorld ?? 0;
          existing.total =
            (report.cashAndCredit ?? 0) * ((report.marketFee ?? 0) / 100) -
            ((report.ebt ?? 0) +
              (report.snapBonus ?? 0) +
              (report.producePlus ?? 0) +
              (report.wic ?? 0) +
              (report.sfmnp ?? 0) +
              (report.fmnpBonus ?? 0) +
              (report.cardCoupon ?? 0) +
              (report.marketGoods ?? 0) +
              (report.gWorld ?? 0));

          acc.set(report.season.name, existing);

          if (report.penalty) {
            penaltiesAndCredits.push({
              season: report.season.name,
              penalty: report.penalty,
              type: report.penaltyType,
              description: report.penaltyDescription,
            });
          }

          if (report.credit) {
            penaltiesAndCredits.push({
              season: report.season.name,
              credit: report.credit,
              type: report.creditType,
              description: report.creditDescription,
            });
          }

          return [acc, penaltiesAndCredits];
        },
        [new Map(), []],
      );

      const salesSubtotal = Array.from(sales.values()).reduce<number>(
        (acc, sale: any) => {
          acc += sale.total;
          return acc;
        },
        0,
      );
      const penaltySubtotal = Array.from(
        penaltiesAndCredits.values(),
      ).reduce<number>((acc, penalty: any) => {
        acc += penalty.penalty ? penalty.penalty : 0;
        return acc;
      }, 0);
      const creditSubtotal = Array.from(
        penaltiesAndCredits.values(),
      ).reduce<number>((acc, credit: any) => {
        acc += credit.credit ? credit.credit : 0;
        return acc;
      }, 0);
      // console.log("***salesSubtotal", salesSubtotal);
      // console.log("***penaltySubtotal", penaltySubtotal);
      // console.log("***creditSubtotal", creditSubtotal);
      const total = salesSubtotal + penaltySubtotal - creditSubtotal;
      const invoice = await req.payload.create({
        collection: "invoices",
        data: {
          vendor: key,
          marketMonth: month,
          sales: Array.from(sales.values()),
          salesSubtotal,
          penaltiesAndCredits,
          penaltySubtotal,
          creditSubtotal,
          total,
          reports: value.map((report) => report.id),
          date: new Date().toISOString(),
        },
      });
      invoicesArray.push(invoice);
      // for (const report of value) {
      //   const updated = await req.payload.update({
      //     collection: "sales-reports",
      //     id: report.id,
      //     data: {
      //       invoiceDate: new Date().toISOString(),
      //     },
      //   });
      // }
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

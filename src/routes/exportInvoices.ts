import Papa from "papaparse";
import payload from "payload";

const exportInvoices = async (req, res, next) => {
  const invoices = await req.payload.find({
    collection: "invoices",
    limit: 9999,
  });

  let exported = invoices.docs.map((report) => {
    let markets = [];

    if (report.sales.length) {
      report.sales.map((sale, index) => {
        let marketSales = {
          invoiceDate: report.date,
          customerName: report.vendor.name,
          customerContact: report.vendor.email ? report.vendor.email : "",
          customerStreet: report.vendor.address.street,
          customerCity: report.vendor.address.city
            ? report.vendor.address.city
            : "",
          customerState: report.vendor.address.state,
          customerZipcode: report.vendor.address.zipcode,
          invoiceOrCredit: report.total >= 0 ? "Invoice" : "Credit memo",
          amount: Math.abs(report.total.toFixed(2)),
          [`marketName-${index}`]: sale.season,
          [`marketFee-${index}`]: (
            (sale.marketFee / 100) *
            sale.cashAndCredit
          ).toFixed(2),
          [`cardCoupon-${index}`]: sale.cardCoupon,
          [`ebt-${index}`]: sale.ebt,
          [`fmnpBonus-${index}`]: sale.fmnpBonus,
          [`gWorld-${index}`]: sale.gWorld,
          [`marketGoods-${index}`]: sale.marketGoods,
          [`producePlus-${index}`]: sale.producePlus,
          [`sfmnp-${index}`]: sale.sfmnp,
          [`snapBonus-${index}`]: sale.snapBonus,
          [`wic-${index}`]: sale.wic,
        };
        markets = [...markets, marketSales];
      });
    }

    return markets;
  });

  exported = exported.flat();

  // if date and exported == false, update to true
  const result = await payload.update({
    collection: "invoices", // required
    where: {
      and: [
        // nested array of AND conditions
        {
          exported: { equals: false },
        },
        {
          approved: { equals: true },
        },
      ],
    },
    data: {
      exported: true,
    },
    depth: 0,
  });

  console.log("result::::::::::::::::");
  console.log(result);

  /**
   * when an invoice has been exported,
   * the sales reports that make up that invoice
   * needs an invoice date
   * */
  // const reportsToUpdate = []
  const approvedInvoices = invoices.docs.filter((invoice) => invoice.approved);
  const reportsToUpdate = approvedInvoices
    .map((invoice) => invoice.reports)
    .flat();

  reportsToUpdate.map(async (report) => {
    const updated = await req.payload.update({
      collection: "sales-reports",
      id: report.id,
      data: {
        invoiceDate: new Date().toISOString(),
      },
    });
  });

  const today = new Date();
  const todayString = today.toISOString();

  const file = await Papa.unparse(exported);
  res.attachment(`invoices-export-${todayString}.csv`);
  res.type("txt");

  return res.status(200).send(file);
};

export { exportInvoices };

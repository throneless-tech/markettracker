import Papa from "papaparse";
import payload from "payload";

const exportInvoices = async (req, res, next) => {
  const invoices = await req.payload.find({
    collection: "invoices",
    limit: 9999,
  });

  console.log("invoices??", invoices);

  const exported = invoices.docs.map((report) => {
    return {
      invoiceDate: report.date,
      customerName: report.vendor.name,
      item: report.total >= 0 ? "Market Fee" : "Token by Type",
      amount: Math.abs(report.total),
    };
  });

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

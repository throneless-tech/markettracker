import Papa from "papaparse";

const exportInvoices = async (req, res, next) => {
  const reports = await req.payload.find({
    collection: "invoices",
    limit: 9999,
  });

  const exported = reports.docs.map((report) => {
    return {
      invoiceDate: report.date,
      customerName: report.vendor.name,
      item: report.total >= 0 ? "Market Fee" : "Token by Type",
      amount: Math.abs(report.total),
    };
  });

  const file = await Papa.unparse(exported);
  res.attachment("export.csv");
  res.type("txt");
  return res.status(200).send(file);
};

export { exportInvoices };

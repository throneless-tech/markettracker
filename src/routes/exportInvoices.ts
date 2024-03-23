import Papa from "papaparse";
import payload from "payload";

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

  // if date and exported == false, update to true
  const result = await payload.update({
    collection: "invoices", // required
    where: {
      exported: { equals: false },
    },
    data: {
      exported: true,
    },
    depth: 0,
  });

  const today = new Date();
  const todayString = today.toISOString();

  const file = await Papa.unparse(exported);
  res.attachment(`invoices-export-${todayString}.csv`);
  res.type("txt");
  return res.status(200).send(file);
};

export { exportInvoices };

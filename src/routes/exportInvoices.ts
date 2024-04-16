import { writeFile } from "fs/promises";
import Papa from "papaparse";
import payload from "payload";
import { BlobWriter, TextReader, ZipWriter } from "@zip.js/zip.js";

const exportInvoices = async (req, res, next) => {
  const invoices = await req.payload.find({
    collection: "invoices",
    where: {
      and: [
        {
          approved: {
            equals: true,
          },
        },
        {
          exported: {
            equals: true,
          },
        },
      ],
    },
    limit: 9999,
  });

  let invoiceCsv, creditMemoCsv;

  let exportedInvoices = invoices.docs.map((report) => {
    let theseInvoices = [];

    if (report.sales.length) {
      report.sales.map((sale, index) => {
        // TODO FIXME fix year to be dynamic
        // TODO FIXME ensure day of week is correct if needed
        let marketFeeRow = [
          "Invoice",
          report.date,
          "",
          report.vendor.name,
          "Market Fees:Market Fee",
          `${sale.season} Farmers' Market Fee ${
            report.marketMonth.charAt(0).toUpperCase() +
            report.marketMonth.slice(1)
          } 2024, Gross Sales ${Math.abs(report.total.toFixed(2))}`,
          `Program - Farmers Markets:Farmers Markets - All:${sale.region}:${sale.season}`,
          (sale.marketFee / 100) * sale.cashAndCredit,
        ];

        theseInvoices = [...theseInvoices, marketFeeRow];

        let cardCouponRow,
          ebtRow,
          fmnpBonusRow,
          gWorldRow,
          marketGoodsRow,
          producePlusRow,
          sfmnpRow,
          snapBonusRow,
          wicRow;

        if (sale.cardCoupon) {
          cardCouponRow = [
            "Invoice",
            report.date,
            "",
            report.vendor.name,
            "Tokens:Card Coupon",
            `FIXME Card Coupon information`,
            `Program - Farmers Markets:Farmers Markets - All:${sale.region}:${sale.season}`,
            sale.cardCoupon,
          ];
          theseInvoices = [...theseInvoices, cardCouponRow];
        }

        if (sale.ebt) {
          ebtRow = [
            "Invoice",
            report.date,
            "",
            report.vendor.name,
            "Tokens:EBT",
            `FIXME EBT information`,
            `Program - Farmers Markets:Farmers Markets - All:${sale.region}:${sale.season}`,
            sale.ebt,
          ];
          theseInvoices = [...theseInvoices, ebtRow];
        }

        if (sale.fmnpBonus) {
          fmnpBonusRow = [
            "Invoice",
            report.date,
            "",
            report.vendor.name,
            "Tokens:FMNP Bonus",
            `FIXME FMNP Bonus information`,
            `Program - Farmers Markets:Farmers Markets - All:${sale.region}:${sale.season}`,
            sale.fmnpBonus,
          ];
          theseInvoices = [...theseInvoices, fmnpBonusRow];
        }

        if (sale.gWorld) {
          gWorldRow = [
            "Invoice",
            report.date,
            "",
            report.vendor.name,
            "Tokens:GWorld",
            `FIXME GWorld information`,
            `Program - Farmers Markets:Farmers Markets - All:${sale.region}:${sale.season}`,
            sale.gWorld,
          ];
          theseInvoices = [...theseInvoices, gWorldRow];
        }

        if (sale.marketGoods) {
          marketGoodsRow = [
            "Invoice",
            report.date,
            "",
            report.vendor.name,
            "Tokens:Market Goods",
            `Promo/Gift/Market Goods Coupons/Tokens Redeemed (yellow)`,
            `Program - Farmers Markets:Farmers Markets - All:${sale.region}:${sale.season}`,
            sale.marketGoods,
          ];
          theseInvoices = [...theseInvoices, marketFeeRow];
        }

        if (sale.producePlus) {
          producePlusRow = [
            "Invoice",
            report.date,
            "",
            report.vendor.name,
            "Tokens:Produce Plus",
            `FIXME Produce Plus information`,
            `Program - Farmers Markets:Farmers Markets - All:${sale.region}:${sale.season}`,
            sale.producePlus,
          ];
          theseInvoices = [...theseInvoices, producePlusRow];
        }

        if (sale.sfmnp) {
          sfmnpRow = [
            "Invoice",
            report.date,
            "",
            report.vendor.name,
            "Tokens:SFMNP",
            `FIXME SFMNP information`,
            `Program - Farmers Markets:Farmers Markets - All:${sale.region}:${sale.season}`,
            sale.sfmnp,
          ];
          theseInvoices = [...theseInvoices, sfmnpRow];
        }

        if (sale.snapBonus) {
          snapBonusRow = [
            "Invoice",
            report.date,
            "",
            report.vendor.name,
            "Tokens:Produce Plus",
            `SNAP/EBT Matching Coupons/Tokens Redeemed (white)`,
            `Program - Farmers Markets:Farmers Markets - All:${sale.region}:${sale.season}`,
            sale.snapBonus,
          ];
          theseInvoices = [...theseInvoices, snapBonusRow];
        }

        if (sale.wic) {
          wicRow = [
            "Invoice",
            report.date,
            "",
            report.vendor.name,
            "Tokens:WIC Bonus",
            `WIC Matching Coupons/Tokens Redeemed (red)`,
            `Program - Farmers Markets:Farmers Markets - All:${sale.region}:${sale.season}`,
            sale.wic,
          ];
          theseInvoices = [...theseInvoices, wicRow];
        }
      });
    }

    return theseInvoices;
  });

  let exportedCreditMemos = invoices.docs.map((report) => {
    let theseCreditReports = [];

    if (report.sales.length) {
      report.sales.map((sale, index) => {
        // TODO FIXME fix year to be dynamic
        // TODO FIXME ensure day of week is correct if needed
        let marketFeeRow = [
          "Credit memo",
          report.date,
          "",
          report.vendor.name,
          "Market Fees:Market Fee",
          `${sale.season} Farmers' Market Fee ${
            report.marketMonth.charAt(0).toUpperCase() +
            report.marketMonth.slice(1)
          } 2024, Gross Sales ${Math.abs(report.total.toFixed(2))}`,
          `Program - Farmers Markets:Farmers Markets - All:${sale.region}:${sale.season}`,
          (sale.marketFee / 100) * sale.cashAndCredit,
        ];

        theseCreditReports = [...theseCreditReports, marketFeeRow];

        let cardCouponRow,
          ebtRow,
          fmnpBonusRow,
          gWorldRow,
          marketGoodsRow,
          producePlusRow,
          sfmnpRow,
          snapBonusRow,
          wicRow;

        if (sale.cardCoupon) {
          cardCouponRow = [
            "Credit memo",
            report.date,
            "",
            report.vendor.name,
            "Tokens:Card Coupon",
            `FIXME Card Coupon information`,
            `Program - Farmers Markets:Farmers Markets - All:${sale.region}:${sale.season}`,
            sale.cardCoupon,
          ];
          theseCreditReports = [...theseCreditReports, cardCouponRow];
        }

        if (sale.ebt) {
          ebtRow = [
            "Credit memo",
            report.date,
            "",
            report.vendor.name,
            "Tokens:EBT",
            `FIXME EBT information`,
            `Program - Farmers Markets:Farmers Markets - All:${sale.region}:${sale.season}`,
            sale.ebt,
          ];
          theseCreditReports = [...theseCreditReports, ebtRow];
        }

        if (sale.fmnpBonus) {
          fmnpBonusRow = [
            "Credit memo",
            report.date,
            "",
            report.vendor.name,
            "Tokens:FMNP Bonus",
            `FIXME FMNP Bonus information`,
            `Program - Farmers Markets:Farmers Markets - All:${sale.region}:${sale.season}`,
            sale.fmnpBonus,
          ];
          theseCreditReports = [...theseCreditReports, fmnpBonusRow];
        }

        if (sale.gWorld) {
          gWorldRow = [
            "Credit memo",
            report.date,
            "",
            report.vendor.name,
            "Tokens:GWorld",
            `FIXME GWorld information`,
            `Program - Farmers Markets:Farmers Markets - All:${sale.region}:${sale.season}`,
            sale.gWorld,
          ];
          theseCreditReports = [...theseCreditReports, gWorldRow];
        }

        if (sale.marketGoods) {
          marketGoodsRow = [
            "Credit memo",
            report.date,
            "",
            report.vendor.name,
            "Tokens:Market Goods",
            `Promo/Gift/Market Goods Coupons/Tokens Redeemed (yellow)`,
            `Program - Farmers Markets:Farmers Markets - All:${sale.region}:${sale.season}`,
            sale.marketGoods,
          ];
          theseCreditReports = [...theseCreditReports, marketFeeRow];
        }

        if (sale.producePlus) {
          producePlusRow = [
            "Credit memo",
            report.date,
            "",
            report.vendor.name,
            "Tokens:Produce Plus",
            `FIXME Produce Plus information`,
            `Program - Farmers Markets:Farmers Markets - All:${sale.region}:${sale.season}`,
            sale.producePlus,
          ];
          theseCreditReports = [...theseCreditReports, producePlusRow];
        }

        if (sale.sfmnp) {
          sfmnpRow = [
            "Credit memo",
            report.date,
            "",
            report.vendor.name,
            "Tokens:SFMNP",
            `FIXME SFMNP information`,
            `Program - Farmers Markets:Farmers Markets - All:${sale.region}:${sale.season}`,
            sale.sfmnp,
          ];
          theseCreditReports = [...theseCreditReports, sfmnpRow];
        }

        if (sale.snapBonus) {
          snapBonusRow = [
            "Credit memo",
            report.date,
            "",
            report.vendor.name,
            "Tokens:Produce Plus",
            `SNAP/EBT Matching Coupons/Tokens Redeemed (white)`,
            `Program - Farmers Markets:Farmers Markets - All:${sale.region}:${sale.season}`,
            sale.snapBonus,
          ];
          theseCreditReports = [...theseCreditReports, snapBonusRow];
        }

        if (sale.wic) {
          wicRow = [
            "Credit memo",
            report.date,
            "",
            report.vendor.name,
            "Tokens:WIC Bonus",
            `WIC Matching Coupons/Tokens Redeemed (red)`,
            `Program - Farmers Markets:Farmers Markets - All:${sale.region}:${sale.season}`,
            sale.wic,
          ];
          theseCreditReports = [...theseCreditReports, wicRow];
        }
      });
    }

    return theseCreditReports;
  });

  exportedInvoices = exportedInvoices.flat();
  exportedCreditMemos = exportedCreditMemos.flat();

  invoiceCsv = {
    fields: ["Type", "Date", "Num", "Name", "Item", "Memo", "Class", "Amount"],
    data: exportedInvoices,
  };

  creditMemoCsv = {
    fields: ["Type", "Date", "Num", "Name", "Item", "Memo", "Class", "Amount"],
    data: exportedCreditMemos,
  };

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

  const invoiceFile = await Papa.unparse(invoiceCsv);
  const creditMemoFile = await Papa.unparse(creditMemoCsv);

  // zip up the two files into an archive for ease of downloading
  const invoiceReader = new TextReader(invoiceFile);
  const creditMemoReader = new TextReader(creditMemoFile);

  async function getZipFileBlob() {
    const zipWriter = new ZipWriter(new BlobWriter("application/zip"));
    await Promise.all([
      zipWriter.add(`invoices-${todayString}.csv`, invoiceReader),
      zipWriter.add(`credit-memos-${todayString}.csv`, creditMemoReader),
    ]);
    return zipWriter.close();
  }

  const blob = await getZipFileBlob();
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  res.set(
    "Content-Disposition",
    `attachment; filename=invoices-credit-memos-export-${todayString}.zip`,
  );
  res.set("Content-Length", buffer.length);
  // res.status(200);
  // res.send(buffer);
  // res.end(buffer, 'binary');

  return res.status(200).send(buffer);
};

export { exportInvoices };

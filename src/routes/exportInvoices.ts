import Papa from "papaparse";
import payload from "payload";

const exportInvoices = async (req, res, next) => {
  const invoices = await req.payload.find({
    collection: "invoices",
    where: {
      approved: {
        equals: true,
      },
    },
    limit: 9999,
  });

  let csvObject;

  let exported = invoices.docs.map((report) => {
    let markets = [];

    if (report.sales.length) {
      report.sales.map((sale, index) => {
        // TODO FIXME fix year to be dynamic
        // TODO FIXME ensure day of week is correct if needed
        let marketFeeRow = [
          report.total >= 0 ? "Invoice" : "Credit memo",
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

        markets = [...markets, marketFeeRow];

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
            report.total >= 0 ? "Invoice" : "Credit memo",
            report.date,
            "",
            report.vendor.name,
            "Tokens:Card Coupon",
            `FIXME Card Coupon information`,
            `Program - Farmers Markets:Farmers Markets - All:${sale.region}:${sale.season}`,
            sale.cardCoupon,
          ];
          markets = [...markets, cardCouponRow];
        }

        if (sale.ebt) {
          ebtRow = [
            report.total >= 0 ? "Invoice" : "Credit memo",
            report.date,
            "",
            report.vendor.name,
            "Tokens:EBT",
            `FIXME EBT information`,
            `Program - Farmers Markets:Farmers Markets - All:${sale.region}:${sale.season}`,
            sale.ebt,
          ];
          markets = [...markets, ebtRow];
        }

        if (sale.fmnpBonus) {
          fmnpBonusRow = [
            report.total >= 0 ? "Invoice" : "Credit memo",
            report.date,
            "",
            report.vendor.name,
            "Tokens:FMNP Bonus",
            `FIXME FMNP Bonus information`,
            `Program - Farmers Markets:Farmers Markets - All:${sale.region}:${sale.season}`,
            sale.fmnpBonus,
          ];
          markets = [...markets, fmnpBonusRow];
        }

        if (sale.gWorld) {
          gWorldRow = [
            report.total >= 0 ? "Invoice" : "Credit memo",
            report.date,
            "",
            report.vendor.name,
            "Tokens:GWorld",
            `FIXME GWorld information`,
            `Program - Farmers Markets:Farmers Markets - All:${sale.region}:${sale.season}`,
            sale.gWorld,
          ];
          markets = [...markets, gWorldRow];
        }

        if (sale.marketGoods) {
          marketGoodsRow = [
            report.total >= 0 ? "Invoice" : "Credit memo",
            report.date,
            "",
            report.vendor.name,
            "Tokens:Market Goods",
            `Promo/Gift/Market Goods Coupons/Tokens Redeemed (yellow)`,
            `Program - Farmers Markets:Farmers Markets - All:${sale.region}:${sale.season}`,
            sale.marketGoods,
          ];
          markets = [...markets, marketFeeRow];
        }

        if (sale.producePlus) {
          producePlusRow = [
            report.total >= 0 ? "Invoice" : "Credit memo",
            report.date,
            "",
            report.vendor.name,
            "Tokens:Produce Plus",
            `FIXME Produce Plus information`,
            `Program - Farmers Markets:Farmers Markets - All:${sale.region}:${sale.season}`,
            sale.producePlus,
          ];
          markets = [...markets, producePlusRow];
        }

        if (sale.sfmnp) {
          sfmnpRow = [
            report.total >= 0 ? "Invoice" : "Credit memo",
            report.date,
            "",
            report.vendor.name,
            "Tokens:SFMNP",
            `FIXME SFMNP information`,
            `Program - Farmers Markets:Farmers Markets - All:${sale.region}:${sale.season}`,
            sale.sfmnp,
          ];
          markets = [...markets, sfmnpRow];
        }

        if (sale.snapBonus) {
          snapBonusRow = [
            report.total >= 0 ? "Invoice" : "Credit memo",
            report.date,
            "",
            report.vendor.name,
            "Tokens:Produce Plus",
            `SNAP/EBT Matching Coupons/Tokens Redeemed (white)`,
            `Program - Farmers Markets:Farmers Markets - All:${sale.region}:${sale.season}`,
            sale.snapBonus,
          ];
          markets = [...markets, snapBonusRow];
        }

        if (sale.wic) {
          wicRow = [
            report.total >= 0 ? "Invoice" : "Credit memo",
            report.date,
            "",
            report.vendor.name,
            "Tokens:WIC Bonus",
            `WIC Matching Coupons/Tokens Redeemed (red)`,
            `Program - Farmers Markets:Farmers Markets - All:${sale.region}:${sale.season}`,
            sale.wic,
          ];
          markets = [...markets, wicRow];
        }
      });
    }

    return markets;
  });

  // exported = exported.flat();

  csvObject = {
    fields: ["Type", "Date", "Num", "Name", "Item", "Memo", "Class", "Amount"],
    data: [exported],
  };

  // let exportedInvoices = invoices.docs.filter(report => report.total >= 0)
  // exportedInvoices.map(report => {
  //   return {
  //     type: "Invoice",
  //     date: report.date,
  //     num: "",
  //     name: report.vendor.name,
  //     // item:
  //     // memo:
  //     // class:
  //     amount: report.total,
  //   };
  // })

  // let exportedCreditMemos = invoices.docs.filter(report => report.total < 0);
  // exportedCreditMemos.map(report => {
  //   return {
  //     type: "Credit Memo",
  //     date: report.date,
  //     num: "",
  //     name: report.vendor.name,
  //     // item:
  //     // memo:
  //     // class:
  //     amount: Math.abs(report.total),
  //   };
  // })

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

  console.log("csvObject::::::::::::::::");
  console.log(csvObject);

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

  const file = await Papa.unparse(csvObject);
  res.attachment(`invoices-export-${todayString}.csv`);
  res.type("txt");

  return res.status(200).send(file);
};

export { exportInvoices };

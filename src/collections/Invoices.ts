import { CollectionConfig } from "payload/types";
import InvoicesList from "../components/Invoices/InvoicesList";
import InvoicesEdit from "../components/Invoices/InvoicesEdit";
import { monthlyInvoices } from "../routes/monthlyInvoices";

const FullMonths = [
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

export const Invoices: CollectionConfig = {
  slug: "invoices",
  admin: {
    components: {
      views: {
        List: InvoicesList,
        Edit: InvoicesEdit,
      },
    },
  },
  endpoints: [{ path: "/generate", method: "get", handler: monthlyInvoices }],
  fields: [
    // {
    //   name: "id",
    //   type: "text",
    // },
    {
      name: "amountOwed",
      type: "number",
    },
    {
      name: "paid",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "penalty",
      type: "number",
    },
    {
      name: "credit",
      type: "number",
    },
    {
      name: "date",
      label: "Invoice date",
      type: "date",
    },
    {
      name: "marketMonth",
      type: "select",
      options: FullMonths.map((month) => {
        return {
          label: month,
          value: month,
        };
      }),
    },
    {
      name: "vendor",
      type: "relationship",
      relationTo: "vendors",
      hasMany: false,
      required: true,
    },
    {
      name: "reports",
      type: "relationship",
      relationTo: "sales-reports",
      hasMany: true,
    },
  ],
};

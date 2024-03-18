import { CollectionConfig } from "payload/types";
import InvoicesList from "../components/Invoices/InvoicesList";
import InvoicesEdit from "../components/Invoices/InvoicesEdit";
import { monthlyInvoices } from "../routes/monthlyInvoices";
import { exportInvoices } from "../routes/exportInvoices";
import { withFormContext } from "../utils/withFormContext";

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
        Edit: withFormContext(InvoicesEdit),
      },
    },
  },
  endpoints: [
    { path: "/generate", method: "get", handler: monthlyInvoices },
    { path: "/export", method: "get", handler: exportInvoices },
  ],
  fields: [
    // {
    //   name: "id",
    //   type: "text",
    // },

    {
      name: "paid",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "approved",
      type: "checkbox",
      defaultValue: false,
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
      name: "sales",
      type: "array",
      fields: [
        {
          name: "season",
          type: "text",
        },
        {
          name: "marketDays",
          type: "number",
        },
        {
          name: "cashAndCredit",
          type: "number",
        },
        {
          name: "marketFee",
          type: "number",
        },
        {
          name: "ebt",
          type: "number",
        },
        {
          name: "snapBonus",
          type: "number",
        },
        {
          name: "producePlus",
          type: "number",
        },
        {
          name: "wic",
          type: "number",
        },
        {
          name: "sfmnp",
          type: "number",
        },
        {
          name: "fmnpBonus",
          type: "number",
        },
        {
          name: "cardCoupon",
          type: "number",
        },
        {
          name: "marketGoods",
          type: "number",
        },
        {
          name: "gWorld",
          type: "number",
        },
        {
          name: "total",
          type: "number",
        },
      ],
    },
    {
      name: "penalties",
      type: "array",
      fields: [
        {
          name: "season",
          type: "text",
        },
        {
          name: "penalty",
          type: "number",
        },
        {
          name: "description",
          type: "text",
        },
        {
          name: "type",
          type: "text",
        },
      ],
    },
    {
      name: "salesSubtotal",
      type: "number",
    },
    {
      name: "penaltySubtotal",
      type: "number",
    },
    {
      name: "total",
      type: "number",
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

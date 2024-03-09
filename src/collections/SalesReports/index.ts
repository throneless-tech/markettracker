import { CollectionConfig } from "payload/types";
import { withFormContext } from "../../utils/withFormContext";

import CustomSalesReportsList from "../../components/SalesReports/CustomSalesReportsList";
import CustomSalesReportsEdit from "../../components/SalesReports/CustomSalesReportsEdit";

import { reportMonth } from "./populateMonth";

export const SalesReports: CollectionConfig = {
  slug: "sales-reports",
  defaultSort: "day",
  admin: {
    components: {
      views: {
        Edit: withFormContext(CustomSalesReportsEdit),
        List: CustomSalesReportsList,
      },
    },
    // useAsTitle: "name",
  },
  fields: [
    {
      name: "vendor",
      type: "relationship",
      relationTo: "vendors",
      hasMany: false,
      required: true,
    },
    // {
    //   name: "market",
    //   type: "relationship",
    //   relationTo: "markets",
    //   hasMany: false,
    //   required: true,
    // },
    {
      name: "season",
      type: "relationship",
      relationTo: "seasons",
      hasMany: false,
      required: true,
    },
    {
      name: "day",
      type: "date",
      // required: true,
      admin: {
        date: {
          pickerAppearance: "dayOnly",
        },
      },
    },
    {
      name: "month",
      type: "text",
      // required: true,
    },
    {
      name: "cashAndCredit",
      label: "Cash & Credit Sales",
      type: "number",
      // required: true,
      // defaultValue: 0,
      admin: {
        description: "Enter the sum total of Cash and Credit sales",
        placeholder: "$0",
      },
    },
    {
      name: "producePlus",
      label: "Produce Plus Sales",
      type: "number",
      // required: true,
      // defaultValue: 0,
      admin: {
        description:
          "Enter the sum total of Produce Plus sales (only applies in DC)",
        placeholder: "$0",
      },
    },
    {
      name: "sfmnp",
      label: "SFMNP Sales",
      type: "number",
      // required: true,
      // defaultValue: 0,
      admin: {
        description:
          "Enter the sum total of Seniors Farmers' Market Nutrition Program sales",
        placeholder: "$0",
      },
    },
    {
      name: "wic",
      label: "WIC Sales",
      type: "number",
      // required: true,
      // defaultValue: 0,
      admin: {
        description:
          "Enter the sum total of Special Supplemental Nutrition Program for Women, Infants, and Children (WIC) sales",
        placeholder: "$0",
      },
    },
    {
      name: "ebt",
      label: "EBT/SNAP",
      type: "number",
      // required: true,
      // defaultValue: 0,
      admin: {
        description: "Enter the sum total of EBT/SNAP sales",
        placeholder: "$0",
      },
    },
    {
      name: "snapBonus",
      label: "SNAP Bonus",
      type: "number",
      // required: true,
      // defaultValue: 0,
      admin: {
        description: "Enter the sum total of SNAP Bonus sales",
        placeholder: "$0",
      },
    },
    {
      name: "fmnpBonus",
      label: "FMNP Bonus",
      type: "number",
      // required: true,
      // defaultValue: 0,
      admin: {
        description: "Enter the sum total of FMNP Bonus sales",
        placeholder: "$0",
      },
    },
    {
      name: "cardCoupon",
      label: "Credit card coupon",
      type: "number",
      // required: true,
      // defaultValue: 0,
      admin: {
        description: "Enter the sum total of credit card coupon sales",
        placeholder: "$0",
      },
    },
    {
      name: "marketGoods",
      label: "Market Goods coupon",
      type: "number",
      // required: true,
      // defaultValue: 0,
      admin: {
        description: "Enter the sum total of Market Goods coupon sales",
        placeholder: "$0",
      },
    },
    {
      name: "gWorld",
      label: "GWorld coupon",
      type: "number",
      // required: true,
      // defaultValue: 0,
      admin: {
        description: "Enter the sum total of GWorld coupon sales",
        placeholder: "$0",
      },
    },
  ],
  hooks: {
    beforeChange: [reportMonth],
  },
};

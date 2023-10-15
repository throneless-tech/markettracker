import { CollectionConfig } from "payload/types";
import { createCollectionSeason } from "./hooks/createCollectionSeasons";
import { createSlugField } from "./hooks/createSlugField";

export const Seasons: CollectionConfig = {
  slug: "seasons",
  admin: {
    useAsTitle: "name",
  },
  hooks: {
    beforeChange: [createSlugField],
    afterChange: [createCollectionSeason],
  },
  fields: [
    {
      name: "name",
      label: "Season Name",
      type: "text",
      required: true,
      admin: {
        placeholder: "Winter 2024",
      },
    },
    {
      name: "isAccepting",
      label: "Accepting Applications",
      type: "checkbox",
      required: true,
    },
    {
      name: "marketDates",
      label: "Market Dates",
      type: "group",
      fields: [
        {
          name: "startDate",
          label: "Start date",
          type: "date",
          admin: {
            date: {
              pickerAppearance: "dayOnly",
            },
          },
        },
        {
          name: "endDate",
          label: "End date",
          type: "date",
          admin: {
            date: {
              pickerAppearance: "dayOnly",
            },
          },
        },
      ],
      admin: {
        description: "Select a start and end date for the season",
      },
    },
    {
      name: "marketTime",
      label: "Market Time",
      type: "group",
      fields: [
        {
          name: "startTime",
          label: "Start time",
          type: "date",
          admin: {
            date: {
              pickerAppearance: "timeOnly",
            },
            description: "Start Time",
          },
        },
        {
          name: "endTime",
          label: "End time",
          type: "date",
          admin: {
            date: {
              pickerAppearance: "timeOnly",
            },
            description: "End Time",
          },
        },
      ],
    },
    {
      name: "vendorSalesType",
      label: "Vendor Sales Report",
      type: "select",
      options: [
        {
          label: "Cash & Credit",
          value: "cash_credit",
        },
        {
          label: "Produce Plus",
          value: "produce_plus",
        },
        {
          label: "SFMNP",
          value: "sfmnp",
        },
        {
          label: "WIC",
          value: "wic",
        },
        {
          label: "WIC/Senior",
          value: "wic_senior",
        },
        {
          label: "SNAP",
          value: "snap",
        },
        {
          label: "SNAP Bonus",
          value: "snap_bonus",
        },
        {
          label: "Credit/Debit Coupon",
          value: "credit_debit_coupon",
        },
        {
          label: "G World Coupon",
          value: "g_world_coupon",
        },
        {
          label: "Market Goods Coupon",
          value: "market_goods_coupon",
        },
      ],
      admin: {
        description: "Check all that apply",
      },
    },
    {
      name: "marketReportSalesType",
      label: "Market Report",
      type: "select",
      options: [
        {
          label: "Cash & Credit",
          value: "cash_credit",
        },
        {
          label: "Produce Plus",
          value: "produce_plus",
        },
        {
          label: "SFMNP",
          value: "sfmnp",
        },
        {
          label: "WIC",
          value: "wic",
        },
        {
          label: "WIC/Senior",
          value: "wic_senior",
        },
        {
          label: "SNAP",
          value: "snap",
        },
        {
          label: "SNAP Bonus",
          value: "snap_bonus",
        },
        {
          label: "Credit/Debit Coupon",
          value: "credit_debit_coupon",
        },
        {
          label: "G World Coupon",
          value: "g_world_coupon",
        },
        {
          label: "Market Goods Coupon",
          value: "market_goods_coupon",
        },
      ],
      admin: {
        description: "Check all that apply",
      },
    },
    {
      name: "farmersRegisterSalesType",
      label: "Farmers Register App",
      type: "select",
      options: [
        {
          label: "Cash & Credit",
          value: "cash_credit",
        },
        {
          label: "Produce Plus",
          value: "produce_plus",
        },
        {
          label: "SFMNP",
          value: "sfmnp",
        },
        {
          label: "WIC",
          value: "wic",
        },
        {
          label: "WIC/Senior",
          value: "wic_senior",
        },
        {
          label: "SNAP",
          value: "snap",
        },
        {
          label: "SNAP Bonus",
          value: "snap_bonus",
        },
        {
          label: "Credit/Debit Coupon",
          value: "credit_debit_coupon",
        },
        {
          label: "G World Coupon",
          value: "g_world_coupon",
        },
        {
          label: "Market Goods Coupon",
          value: "market_goods_coupon",
        },
      ],
      admin: {
        description: "Check all that apply",
      },
    },
    {
      name: "operators",
      label: "Market Operators",
      type: "relationship",
      relationTo: "users",
      hasMany: true,
      admin: {
        description:
          "Select which Managers will be onsite and supervising during the market.",
      },
    },
    {
      name: "reviewers",
      label: "Market Application Reviewers",
      type: "relationship",
      relationTo: "users",
      hasMany: true,
      minRows: 2,
      admin: {
        description:
          "Select at least 2 Managers who will review and accept applications.",
      },
    },
    {
      name: "productGaps",
      label: "Product Gaps",
      type: "relationship", // TODO placeholder for custom field
      relationTo: "products",
      hasMany: true,
      admin: {
        description: "Check All Products Desired at market",
      },
    },
    {
      name: "market",
      label: "Market",
      type: "relationship",
      relationTo: "markets",
      required: true,
      filterOptions: ({ relationTo }) => {
        if (relationTo === "markets") {
          return {
            name: { exists: true },
          };
        }
      },
    },
  ],
};

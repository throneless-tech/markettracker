import { CollectionConfig } from "payload/types";
import { withFormContext } from "../utils/withFormContext";
import { LicensesEdit } from "../components/Licenses/LicensesEdit";
import LicensesList from "../components/Licenses/LicensesList";

export const Licenses: CollectionConfig = {
  slug: "licenses",
  // hooks: {
  //   afterChange: [emptyProfileNotifications],
  // },
  admin: {
    components: {
      views: {
        Edit: withFormContext(LicensesEdit),
        List: LicensesList,
      },
    },
  },
  fields: [
    {
      name: "document",
      label: "License File",
      type: "upload",
      relationTo: "documents",
      required: true,
    },
    {
      name: "owner",
      label: "License Owner",
      type: "relationship",
      relationTo: "vendors",
      //required: true,
    },
    {
      name: "expiration",
      label: "Expiration Date",
      type: "date",
      //required: true,
      admin: {
        date: {
          pickerAppearance: "dayOnly",
          displayFormat: "MM/dd/yyyy",
        },
        description: "example 01/15/2023",
      },
    },
    {
      name: "type",
      label: "Document Type",
      type: "select",
      options: [
        {
          value: "license",
          label: "Business License",
        },
        {
          value: "insurance",
          label: "Business Insurance Documentation",
        },
      ],
    },
  ],
};

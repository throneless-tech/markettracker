import { CollectionConfig } from "payload/types";

export const Contacts: CollectionConfig = {
  slug: "contacts",
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
    },
    {
      name: "phone",
      label: "Contact Phone Number",
      type: "text",
      required: true,
    },
    {
      name: "type",
      label: "Type of Contact",
      type: "select",
      hasMany: true,
      options: [
        {
          label: "Primary Contact",
          value: "primary",
        },
        {
          label: "Billing/Financial Contact",
          value: "billing",
        },
        {
          label: "At-Market Contact",
          value: "at_market",
        },
      ],
    },
    {
      name: "vendors",
      type: "relationship",
      relationTo: "vendors",
      hasMany: true,
    },
  ],
};

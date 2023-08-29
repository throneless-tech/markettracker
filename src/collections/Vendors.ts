import { CollectionConfig } from "payload/types";

export const Vendors: CollectionConfig = {
  slug: "vendors",
  fields: [
    {
      name: "name",
      label: "Company Name",
      type: "text",
      required: true,
    },
    {
      name: "isPrimaryContact",
      label: "Are you the primary contact for the business?",
      type: "checkbox",
      required: true,
    },
    {
      name: "isBillingContact",
      label: "Are you the billing contact for the business?",
      type: "checkbox",
      required: true,
    },

    {
      name: "address",
      label: "Address",
      type: "group",
      fields: [
        {
          name: "street",
          label: "Street",
          type: "text",
          required: true,
        },
        {
          type: "row",
          fields: [
            {
              name: "city",
              label: "City",
              type: "text",
              required: true,
            },
            {
              name: "state",
              label: "State",
              type: "text",
              required: true,
            },
            {
              name: "zipcode",
              label: "Zipcode",
              type: "text",
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: "isSeparateBilling",
      label: "Enter a different billing address",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description:
          "Check if there is a different address that invoices and payments should be sent to.",
      },
    },
    {
      name: "billingAddress",
      label: "Billing Address",
      type: "group",
      fields: [
        {
          name: "street",
          label: "Street",
          type: "text",
          required: true,
        },
        {
          type: "row",
          fields: [
            {
              name: "city",
              label: "City",
              type: "text",
              required: true,
            },
            {
              name: "state",
              label: "State",
              type: "text",
              required: true,
            },
            {
              name: "zipcode",
              label: "Zipcode",
              type: "text",
              required: true,
            },
          ],
        },
      ],
      admin: {
        condition: (data) => data.isSeparateBilling,
      },
    },
    {
      name: "phoneNumber",
      label: "Company Phone Number",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Brief Company Description",
      type: "textarea",
      required: true,
      admin: {
        description: "TODO",
      },
    },
    {
      name: "yearEstablished",
      label: "Year Established",
      type: "number",
      admin: {
        description: "What year was your company established?",
      },
    },
    {
      name: "employees",
      label: "# of employees",
      type: "group",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "fullTime",
              label: "Full Time",
              type: "number",
            },
            {
              name: "partTime",
              label: "Part Time",
              type: "number",
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "interns",
              label: "Interns",
              type: "number",
            },
            {
              name: "h2a",
              label: "H2A",
              type: "number",
            },
            {
              name: "volunteers",
              label: "Volunteers",
              type: "number",
            },
          ],
        },
      ],
      admin: {
        description:
          "Including yourself how many people work for your company?",
      },
    },
    {
      name: "type",
      label: "What type of vendor are you?",
      type: "select",
      required: true,
      hasMany: false,
      options: [
        {
          label: "A regional farmer who sells what I produce on my farm",
          value: "farmer",
        },
        {
          label:
            "A local producer who makes products featuring agricultural ingredients sourced from local farms",
          value: "producer",
        },
        {
          label: "none of the above",
          value: "other",
        },
      ],
      admin: {
        description:
          "Select the category that describes the majority of what you sell.",
      },
    },
    {
      name: "structure",
      label: "What is the business structure of your business?",
      type: "select",
      required: true,
      hasMany: false,
      options: [
        {
          label: "LLC",
          value: "llc",
        },
        {
          label: "Sole Proprietorship",
          value: "sole_proprietor",
        },
        {
          label: "Non-Profit",
          value: "nonprofit",
        },
        {
          label: "Other",
          value: "other",
        },
      ],
      admin: {
        description:
          "Select which type of legal entity your business is registered as in your state.",
      },
    },
    {
      name: "growingPractices",
      label: "Do you use any of the following growing practices?",
      type: "select",
      required: true,
      hasMany: false,
      options: [
        {
          label: "Organic Management",
          value: "organic_management",
        },
        {
          label: "Certified Naturally Grown",
          value: "certified_naturally_grown",
        },
        {
          label: "integrated pest management (IPM)",
          value: "ipm",
        },
        {
          label: "certified organic",
          value: "certified_organic",
        },
        {
          label: "GMO use",
          value: "gmo_use",
        },
        {
          label: "Growth hormone use",
          value: "growth_hormone_use",
        },
      ],
      admin: {
        description: "Check all that apply",
      },
    },
  ],
};

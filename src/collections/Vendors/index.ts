import { CollectionConfig } from "payload/types";
import { VendorsEdit } from "../../components/Vendors/VendorsEdit";
import { VendorsList } from "../../components/Vendors/VendorsList";
//import { beforeReadHook } from "./hooks/beforeReadHook";
import { createFieldContacts } from "./hooks/createFieldContacts";
import {
  afterReadContacts,
  beforeValidateContacts,
} from "./hooks/populateContacts";
import {
  afterReadApplications,
  beforeValidateApplications,
} from "./hooks/populateApplications";

export const Vendors: CollectionConfig = {
  slug: "vendors",
  admin: {
    components: {
      views: {
        Edit: VendorsEdit,
        List: VendorsList,
      },
    },
    pagination: {
      defaultLimit: 9999,
    },
    useAsTitle: "name",
  },
  // hooks: {
  //   beforeRead: [beforeReadHook],
  // },
  fields: [
    {
      name: "name",
      label: "Company Name",
      type: "text",
      index: true,
      required: true,
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "standing",
      label: "What is this vendor's standing?",
      type: "select",
      // defaultValue: {
      //   label: 'Good',
      //   value: 'good',
      // },
      options: [
        {
          label: "Good",
          value: "good",
        },
        {
          label: "Conditional",
          value: "conditional",
        },
        {
          label: "Bad",
          value: "bad",
        },
        {
          label: "Under review",
          value: "underReview",
        },
      ],
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
          //required: true, //temporarily disabled for data import
        },
        {
          type: "row",
          fields: [
            {
              name: "city",
              label: "City",
              type: "text",
              //required: true, //temporarily disabled for data import
            },
            {
              name: "state",
              label: "State",
              type: "text",
              //required: true, //temporarily disabled for data import
            },
            {
              name: "zipcode",
              label: "Zipcode",
              type: "text",
              //required: true, //temporarily disabled for data import
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
      //required: true, //temporarily disabled for data import
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
      //required: true, //temporarily disabled for data import
      hasMany: true,
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
    {
      name: "sellingLocally",
      label: "Where are you selling your products locally?",
      type: "select",
      //required: true, //temporarily disabled for data import
      hasMany: true,
      options: [
        {
          label: "Nowhere Yet",
          value: "nowhere",
        },
        {
          label: "At Fresh Farm markets",
          value: "freshfarm",
        },
        {
          label: "At other, non Fresh Farm, markets or in stores",
          value: "other",
        },
      ],
    },
    {
      name: "otherLocations",
      type: "text",
      admin: {
        placeholder: "Please list other locations you sell products",
      },
    },
    {
      name: "outletImportance",
      label:
        "Rank the following revenue outlets in order of importance to your sales:",
      type: "group",
      fields: [
        {
          name: "stores",
          label: "Stores",
          type: "radio",
          //required: true, //temporarily disabled for data import
          options: ["1", "2", "3", "4", "5"],
          admin: {
            layout: "horizontal",
          },
        },
        {
          name: "markets",
          label: "Farmers Markets",
          type: "radio",
          //required: true, //temporarily disabled for data import
          options: ["1", "2", "3", "4", "5"],
          admin: {
            layout: "horizontal",
          },
        },
        {
          name: "own",
          label: "Own Brick & Mortar",
          type: "radio",
          //required: true, //temporarily disabled for data import
          options: ["1", "2", "3", "4", "5"],
          admin: {
            layout: "horizontal",
          },
        },
        {
          name: "online",
          label: "Online Sales",
          type: "radio",
          //required: true, //temporarily disabled for data import
          options: ["1", "2", "3", "4", "5"],
          admin: {
            layout: "horizontal",
          },
        },
      ],
    },
    {
      name: "sharedKitchen",
      label: "Do you work out of a Shared Kitchen?",
      type: "checkbox",
    },
    {
      name: "sharedKitchenName",
      type: "text",
      admin: {
        placeholder: "Please share the name of the kitchen",
      },
    },
    {
      name: "copacker",
      label: "Do you use a Co-Packer?",
      type: "checkbox",
    },
    {
      name: "copackerName",
      type: "text",
      admin: {
        placeholder: "Please share the name of the co-packer",
      },
    },
    {
      name: "contacts",
      label:
        "Add all the members of your staff that will be manning your booth(s); these contacts will be visible to the managers of markets your participate in.",
      type: "relationship",
      required: true,
      hasMany: true,
      relationTo: "contacts",
      hooks: {
        afterChange: [createFieldContacts],
      },
    },
    {
      name: "licenses",
      label: {
        singular: "Upload Business License",
        plural: "Upload Business Licenses",
      },
      type: "array",
      //required: true, //temporarily disabled for data import
      fields: [
        {
          name: "licenseDocument",
          type: "upload",
          relationTo: "documents",
          required: true,
        },
      ],
      admin: {
        description: "TODO",
      },
    },
    {
      name: "insurance",
      label: "Upload Insurance Documentation",
      type: "array",
      //required: true, //temporarily disabled for data import
      fields: [
        {
          name: "insuranceDocument",
          type: "upload",
          relationTo: "documents",
          required: true,
        },
      ],
      admin: {
        description: "TODO",
      },
    },
    {
      name: "sharedKitchenInsurance",
      label: "Upload Shared Kitchen Insurance Documentation",
      type: "array",
      //required: true, //temporarily disabled for data import
      fields: [
        {
          name: "sharedKitchenInsuranceDocument",
          type: "upload",
          relationTo: "documents",
          required: true,
        },
      ],
      admin: {
        description: "TODO",
      },
    },
    {
      name: "copackerInsurance",
      label: "Upload Co-packer Insurance Documentation",
      type: "array",
      //required: true, //temporarily disabled for data import
      fields: [
        {
          name: "copackerInsuranceDocument",
          type: "upload",
          relationTo: "documents",
          required: true,
        },
      ],
      admin: {
        description: "TODO",
      },
    },
    {
      name: "demographics",
      label: "Demographic Information",
      type: "group",
      fields: [
        {
          name: "firstGeneration",
          label: "Is the business owner a first generation farmer?",
          type: "radio",
          options: [
            {
              label: "Yes",
              value: "yes",
            },
            {
              label: "No",
              value: "no",
            },
            {
              label: "Prefer not to answer",
              value: "no_answer",
            },
          ],
        },
        {
          name: "veteranOwned",
          label: "Is this a Veteran owned business?",
          type: "radio",
          options: [
            {
              label: "Yes",
              value: "yes",
            },
            {
              label: "No",
              value: "no",
            },
            {
              label: "Prefer not to answer",
              value: "no_answer",
            },
          ],
        },
        {
          name: "bipoc",
          label:
            "Do any of the business owners identify as Black, Indigenous, and/or Person of Color?",
          type: "radio",
          options: [
            {
              label: "Yes",
              value: "yes",
            },
            {
              label: "No",
              value: "no",
            },
            {
              label: "Prefer not to answer",
              value: "no_answer",
            },
          ],
        },
        {
          name: "immigrantOrRefugee",
          label: "Is this an immigrant or refugee owned business?",
          type: "radio",
          options: [
            {
              label: "Yes",
              value: "yes",
            },
            {
              label: "No",
              value: "no",
            },
            {
              label: "Prefer not to answer",
              value: "no_answer",
            },
          ],
        },
        {
          name: "lgbtqia",
          label:
            "Is this an LGBTQIA+ (Lesbian, Gay, Bisexual, Transgender, Queer, Intersex, Asexual, Plus) owned business?",
          type: "radio",
          options: [
            {
              label: "Yes",
              value: "yes",
            },
            {
              label: "No",
              value: "no",
            },
            {
              label: "Prefer not to answer",
              value: "no_answer",
            },
          ],
        },
        {
          name: "other",
          label: "Other",
          type: "text",
          admin: {
            description: "self describe",
          },
        },
      ],
      admin: {
        description:
          "The following demographic questions are intended to assess how members of various communities are participating in our programming. The responses will help us make decisions about our outreach, engagement, and programming efforts to ensure we are effectively serving our diverse membership",
      },
    },
    {
      name: "marketing",
      label: "Marketing & Links",
      type: "group",
      fields: [
        {
          name: "website",
          label: "Website Address (if you have one)",
          type: "text",
        },
        {
          name: "instagram",
          label: "Instagram Handle (if you have one)",
          type: "text",
        },
        {
          name: "twitter",
          label: "Twitter Handle (if you have one)",
          type: "text",
        },
        {
          name: "facebook",
          label: "Facebook page (if you have one)",
          type: "text",
        },
        {
          name: "store",
          label: "Online Store (if you have one)",
          type: "text",
        },
        {
          name: "other",
          label:
            "Outside of social media, describe any marketing channels or presence",
          type: "textarea",
          admin: {
            description:
              "If you have a newsletter or other online marketing tools to share with us please do so here.",
          },
        },
        {
          name: "pictures",
          label:
            "Upload some recent images of yoru market set up. If you are new, please share product images and/or diagrams",
          type: "upload",
          relationTo: "media",
        },
      ],
    },
    {
      name: "setupNeeds",
      label: "Set up needs at market",
      type: "group",
      fields: [
        {
          name: "tent",
          label: "Would you like to use a Fresh Farm tent?",
          type: "radio",
          options: ["size 1", "size 2", "size 3", "size 4"],
        },
        {
          name: "generator",
          label: "Do you need access to a generator?",
          type: "checkbox",
        },
        {
          name: "vehicle",
          label: "Will you need to bring a vehicle into the market?",
          type: "checkbox",
        },
      ],
    },
    {
      name: "products", // TODO custom component
      label: "Product Information",
      type: "relationship",
      relationTo: "products",
      hasMany: true,
      admin: {
        description: "What products do you carry? check all that apply",
      },
    },
    {
      name: "sourcing",
      label: "Sourcing Information",
      type: "group",
      fields: [
        {
          name: "outsideVendors",
          label:
            "List vendors outside of FRESHFARMS you source ingredients from",
          type: "textarea",
        },
        {
          name: "freshfarmVendors",
          label: "List FRESHFARM vendors you source ingredients from",
          type: "textarea",
        },
      ],
    },
    {
      name: "applications",
      label: "All applications submitted to markets",
      type: "relationship",
      hasMany: true,
      relationTo: "applications",
    },
  ],
  hooks: {
    afterRead: [afterReadContacts],
    beforeValidate: [beforeValidateContacts],
  },
};

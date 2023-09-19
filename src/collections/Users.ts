import { CollectionConfig } from "payload/types";

const roles = [
  {
    label: "Admin",
    value: "admin",
  },
  {
    label: "Exec",
    value: "exec",
  },
  {
    label: "Market Manager",
    value: "manager",
  },
  {
    label: "Vendor",
    value: "vendor",
  },
];

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  fields: [
    {
      name: "name",
      type: "text",
      //required: true,
    },
    {
      name: "role",
      label: "Role",
      type: "select",
      options: roles,
      //required: true,
    },
    {
      name: "vendor",
      type: "relationship",
      relationTo: "vendors",
      admin: {
        condition: (_, siblingData) => siblingData.role === "vendor",
      },
    },
  ],
};

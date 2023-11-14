import { CollectionConfig } from "payload/types";
//import { withFormContext } from "../../utils/withFormContext";
//import { UsersEdit } from "../../components/Users/UsersEdit";
import { afterReadVendor, beforeValidateVendor } from "./hooks/populateVendor";
import { registerRoute } from "../../routes/register";

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
  admin: {
    useAsTitle: "name",
    // components: {
    //   views: {
    //     Edit: withFormContext(UsersEdit),
    //   },
    // },
  },
  auth: {
    forgotPassword: {
      generateEmailSubject: () => {
        return "Market Tracker - Reset Your Password";
      },
    },
    useAPIKey: true,
  },
  access: {
    // Anyone can create a user
    create: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "role",
      label: "Role",
      type: "select",
      options: roles,
      required: true,
    },
    {
      name: "vendor",
      type: "relationship",
      relationTo: "vendors",
      index: true,
      admin: {
        condition: (_, siblingData) => siblingData.role === "vendor",
      },
    },
  ],
  endpoints: [
    {
      path: "/register",
      method: "post",
      handler: registerRoute,
    },
  ],
  // hooks: {
  //   afterRead: [afterReadVendor],
  //   beforeValidate: [beforeValidateVendor],
  // },
};

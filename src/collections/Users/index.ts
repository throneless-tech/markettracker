import { CollectionConfig } from "payload/types";
//import { withFormContext } from "../../utils/withFormContext";
//import { UsersEdit } from "../../components/Users/UsersEdit";
import { afterReadVendor, beforeValidateVendor } from "./hooks/populateVendor";
import { registerRoute } from "../../routes/register";
import { emailRoute } from "../../routes/email";

const roles = [
  {
    label: "Administrator",
    value: "admin",
  },
  {
    label: "Executive",
    value: "exec",
  },
  {
    label: "Market Operator",
    value: "operator",
  },
  {
    label: "Vendor",
    value: "vendor",
  },
  {
    label: "Senior Staff",
    value: "senior",
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
      required: false,
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
    {
      path: "/:id/email",
      method: "post",
      handler: emailRoute,
    },
  ],
  hooks: {
    afterRead: [afterReadVendor],
    beforeValidate: [beforeValidateVendor],
  },
};

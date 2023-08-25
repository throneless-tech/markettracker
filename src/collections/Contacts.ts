import { CollectionConfig } from "payload/types";

export const Contacts: CollectionConfig = {
  slug: "contacts",
  fields: [
    {
      name: "firstName",
      type: "text",
      required: true,
    },
    {
      name: "lastName",
      type: "text",
    },
    {
      name: "middleName",
      type: "text",
    },
    {
      name: "email",
      type: "email",
    },
  ],
};

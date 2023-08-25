import { CollectionConfig } from "payload/types";

export const Coupons: CollectionConfig = {
  slug: "coupons",
  fields: [
    {
      name: "coupon",
      type: "text",
      required: true,
    },
  ],
};

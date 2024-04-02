import payload from "payload";
import { CollectionBeforeChangeHook } from "payload/types";

export const reportMonth: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
}) => {
  if (operation === "create") {
    const reportDate = new Date(data.day);
    const month = reportDate
      .toLocaleString("default", { month: "long" })
      .toLowerCase();
    return {
      ...data,
      month,
    };
  }
  return data;
};

import payload from "payload";
import { CollectionBeforeChangeHook } from "payload/types";

export const createReviewer: CollectionBeforeChangeHook = async (
  { data, req, operation },
) => {
  if (operation === "create") {
    const user = await payload.findByID({
      collection: "users",
      id: req.user.id,
    });
    data.reviewer = user;
  }
  return data;
};

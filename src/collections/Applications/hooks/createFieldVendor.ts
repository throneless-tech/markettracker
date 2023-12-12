import type { FieldHook } from "payload/types";
import type { Application, Vendor } from "payload/generated-types";

type ApplicationFieldHook = FieldHook<
  Application,
  string | Vendor,
  Application
>;

export const createFieldVendor: ApplicationFieldHook = ({
  value,
  operation,
  req,
}) => {
  if (["create"].includes(operation) && !value) {
    return req.user.vendor ? req.user.vendor.id : req.user.id;
  }
  return value;
};

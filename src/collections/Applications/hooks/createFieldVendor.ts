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
  if (["create"].includes(operation)) {
    return req.user.vendor.id;
  }
  return value;
};

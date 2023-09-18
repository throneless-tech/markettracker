import type { FieldHook } from "payload/types";
import type { Application, Vendor } from "payload/generated-types";

type ApplicationFieldHook = FieldHook<
  Application,
  string | Vendor,
  Application
>;

export const createFieldVendor: ApplicationFieldHook = (
  { value, operation, req },
) => {
  if (operation === "create" && req.user.role === "vendor") {
    return req.user.vendor;
  }
  return value;
};

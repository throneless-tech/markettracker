import payload from "payload";
import type { FieldHook } from "payload/types";
import type { Contact, Vendor } from "payload/generated-types";

type VendorFieldHook = FieldHook<
  Vendor,
  string[] | Contact[],
  Vendor
>;

export const createFieldContacts: VendorFieldHook = async (
  { value, operation, originalDoc },
) => {
  if (["create", "update"].includes(operation)) {
    for (let contact of value) {
      const oldContact = await payload.findByID({
        collection: "contacts",
        id: typeof contact === "string" ? contact : contact.id,
        depth: 0,
      });
      await payload.update({
        collection: "contacts",
        id: oldContact.id,
        data: {
          vendors: [...(oldContact.vendors as string[] || []), originalDoc.id],
        },
      });
    }
  }
  return value;
};

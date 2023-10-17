import payload from "payload";
import {
  CollectionAfterReadHook,
  CollectionBeforeValidateHook,
} from "payload/types";
import { Contact } from "payload/generated-types";

export const afterReadVendor: CollectionAfterReadHook = async ({
  doc, // full document data
}) => {
  if (typeof doc.vendor === "string") {
    const vendor = await payload.findByID({
      collection: "vendors",
      id: doc.vendor,
      depth: 0,
    });
    let contacts: any;
    if (vendor.contacts && vendor.contacts.length) {
      contacts = await payload.find({
        collection: "contacts",
        depth: 0,
        where: { id: { in: vendor.contacts.join(",") } },
      });
    }
    return {
      ...doc,
      vendor: {
        ...vendor,
        contacts: contacts && contacts.docs && contacts.docs.length
          ? contacts.docs
          : vendor.contacts,
      },
    };
  }
  return doc;
};

export const beforeValidateVendor: CollectionBeforeValidateHook = async ({
  data,
}) => {
  if (
    data.vendor && typeof data.vendor === "object"
  ) {
    let id = data.vendor.id;
    if (
      data.vendor.contacts && typeof data.vendor.contacts.length &&
      typeof data.vendor.contacts[0] === "object"
    ) {
      const flattened = await data.vendor.contacts.reduce(
        async (acc: string[], contact: Contact) => {
          const existing = await payload.findByID({
            collection: "contacts",
            id: contact.id,
          });
          if (existing) {
            acc.push(contact.id);
            await payload.update({
              collection: "contacts",
              id: contact.id,
              data: contact,
            });
          } else {
            await payload.create({
              collection: "contacts",
              data: contact,
            });
            acc.push(contact.id);
          }
        },
        [],
      );

      data.vendor.contacts = flattened;
    }
    const existing = await payload.findByID({
      collection: "vendors",
      id,
    });
    if (existing) {
      await payload.update({
        collection: "vendors",
        id,
        data: data.vendor,
      });
    } else {
      ({ id } = await payload.create({
        collection: "vendors",
        data: data.vendor,
      }));
    }
    return { ...data, vendor: id };
  }
  return data;
};

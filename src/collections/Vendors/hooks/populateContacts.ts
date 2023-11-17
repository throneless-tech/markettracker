import payload from "payload";
import {
  CollectionAfterReadHook,
  CollectionBeforeValidateHook,
} from "payload/types";
import type { Contact } from "payload/generated-types";

export const afterReadContacts: CollectionAfterReadHook = async ({
  doc, // full document data
}) => {
  if (
    doc.contacts &&
    doc.contacts.length &&
    typeof doc.contacts[0] === "string"
  ) {
    const contacts = await payload.find({
      collection: "contacts",
      depth: 0,
      where: { id: { in: doc.contacts.join(",") } },
    });
    return { ...doc, contacts: contacts.docs };
  }
  return doc;
};

export const beforeValidateContacts: CollectionBeforeValidateHook = async ({
  data,
}) => {
  if (
    data.contacts &&
    data.contacts.length &&
    typeof data.contacts[0] === "object"
  ) {
    return {
      ...data,
      contacts: data.contacts.map((contact: Contact) => contact.id),
    };
  }
  return data;
};

import payload from "payload";
import {
  CollectionAfterReadHook,
  CollectionBeforeValidateHook,
} from "payload/types";
import type { Contact } from "payload/generated-types";

export const afterReadOperators: CollectionAfterReadHook = async ({
  doc, // full document data
}) => {
  if (
    doc.operators &&
    doc.operators.length &&
    typeof doc.operators[0] === "string"
  ) {
    const operators = await payload.find({
      collection: "contacts",
      depth: 0,
      where: { id: { in: doc.operators.join(",") } },
    });
    return { ...doc, operators: operators.docs };
  }
  return doc;
};

export const beforeValidateOperators: CollectionBeforeValidateHook = async ({
  data,
}) => {
  if (
    data.operators &&
    data.operators.length &&
    typeof data.operators[0] === "object"
  ) {
    return {
      ...data,
      operators: data.operators.map((operator: Contact) => operator.id),
    };
  }

  return data;
};

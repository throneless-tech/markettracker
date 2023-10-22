import payload from "payload";
import {
  CollectionAfterReadHook,
  CollectionBeforeValidateHook,
} from "payload/types";
import { Product } from "payload/generated-types";

export const afterReadProducts: CollectionAfterReadHook = async ({
  doc, // full document data
}) => {
  if (
    doc.products &&
    doc.products.length &&
    typeof doc.products[0] === "string"
  ) {
    const products = await payload.find({
      collection: "products",
      depth: 1,
      where: { id: { in: doc.products.join(",") } },
    });
    return { ...doc, products: products.docs };
  }
  return doc;
};

export const beforeValidateProducts: CollectionBeforeValidateHook = async ({
  data,
}) => {
  if (
    data.products &&
    data.products.length &&
    typeof data.products[0] === "object"
  ) {
    return {
      ...data,
      products: data.products.map((product: Product) => product.id),
    };
  }
  return data;
};

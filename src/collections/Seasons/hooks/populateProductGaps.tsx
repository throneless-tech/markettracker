import payload from "payload";
import {
  CollectionAfterReadHook,
  CollectionBeforeValidateHook,
} from "payload/types";
import type { Product } from "payload/generated-types";

export const afterReadProductGaps: CollectionAfterReadHook = async ({
  doc, // full document data
}) => {
  if (
    doc.productGaps &&
    doc.productGaps.length &&
    typeof doc.productGaps[0] === "string"
  ) {
    const productGaps = await payload.find({
      collection: "products",
      depth: 0,
      where: { id: { in: doc.productGaps.join(",") } },
    });
    return { ...doc, productGaps: productGaps.docs };
  }
  return doc;
};

export const beforeValidateProductGaps: CollectionBeforeValidateHook = async ({
  data,
}) => {
  if (
    data.productGaps &&
    data.productGaps.length &&
    typeof data.productGaps[0] === "object"
  ) {
    return {
      ...data,
      productGaps: data.productGaps.map((product: Product) => product.id),
    };
  }

  return data;
};

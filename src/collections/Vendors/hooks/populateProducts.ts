import payload from "payload";
import {
  CollectionAfterReadHook,
  CollectionBeforeValidateHook,
} from "payload/types";
import type { Product } from "payload/generated-types";

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
};

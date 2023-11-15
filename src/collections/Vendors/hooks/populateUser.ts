import payload from "payload";
import {
  CollectionAfterReadHook,
  CollectionBeforeValidateHook,
} from "payload/types";
import type { User } from "payload/generated-types";

export const beforeValidateUser: CollectionBeforeValidateHook = async ({
  data,
}) => {
  if (data.user && typeof data.user === "object") {
    return {
      ...data,
      user: data.user.id,
    };
  }
};

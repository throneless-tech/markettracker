import { CollectionBeforeChangeHook } from "payload/types";

export const needsAction: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
}) => {
  if (operation === "create" || operation === "update") {
    console.log("DATA =>", data);
    const {
      producePlus,
      cashAndCredit,
      wic,
      sfmnp,
      ebt,
      snapBonus,
      fmnpBonus,
      cardCoupon,
      marketGoods,
      gWorld,
    } = data;

    let needsVendorAction;
    let needsStaffAction;

    if (cashAndCredit === undefined) {
      needsVendorAction = true;
    } else {
      needsVendorAction = false;
    }

    if (
      producePlus === undefined ||
      wic === undefined ||
      sfmnp === undefined ||
      ebt === undefined ||
      snapBonus === undefined ||
      fmnpBonus === undefined ||
      cardCoupon === undefined ||
      marketGoods === undefined ||
      gWorld === undefined
    ) {
      needsStaffAction = true;
    } else {
      needsStaffAction = false;
    }

    return {
      ...data,
      needsVendorAction,
      needsStaffAction,
    };
  }
  return data;
};

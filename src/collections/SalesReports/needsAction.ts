import { CollectionBeforeChangeHook } from "payload/types";

export const needsAction: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
}) => {
  if (operation === "create" || operation === "update") {
    console.log("DATA =>", data);
    let {
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
      location,
    } = data;

    // in Virginia and Maryland, Produce Plus doesn't apply, and therefore always 0
    if (location === "VA" || location === "MD") {
      producePlus = 0;
    }

    // in Virginia, WIC does not apply, and therefore always 0
    if (location === "VA") {
      wic = 0;
    }

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
      producePlus,
      wic,
      needsVendorAction,
      needsStaffAction,
    };
  }
  return data;
};

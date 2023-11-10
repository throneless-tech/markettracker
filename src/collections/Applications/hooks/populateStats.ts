import payload from "payload";
import {
  CollectionAfterReadHook,
  CollectionBeforeValidateHook,
} from "payload/types";
import { Vendor } from "payload/generated-types";

export const afterReadVendor: CollectionAfterReadHook = async ({
  doc, // full document data
}) => {
  const vendor = await payload.findByID({
    id: doc.vendor,
    collection: "vendors",
    depth: 0,
  });
  const season = await payload.findByID({
    id: doc.season,
    collection: "seasons",
    depth: 0,
  });
  const reviews = await payload.find({
    collection: "reviews",
    depth: 0,
    where: { id: { in: doc.reviews.join(",") } },
  });
  const total = reviews.docs.reduce((acc, review) => {
    acc =
      acc +
      review.vendorScore +
      review.productScore +
      review.demographicScore +
      review.attendanceScore +
      review.saturationScore +
      review.setupScore;
    return acc;
  }, 0);
  const gaps = doc.products.reduce((acc, product) => {
    if (
      Array.isArray(season.productGaps) &&
      season.productGaps.map((gap: any) => gap.id).includes(product.id)
    ) {
      acc.push(product);
    }
    return acc;
  }, []);
  return {
    ...doc,
    vendorName: vendor.name,
    vendorType: vendor.type,
    vendorStanding: vendor.standing,
    vendorDemographics: vendor.demographics,
    gapsMet: gaps,
    reviewScore: total / reviews.docs.length,
    numberOfMarkets: Array.isArray(vendor.applications)
      ? vendor.applications.length
      : 1,
  };
};

export const beforeValidateVendor: CollectionBeforeValidateHook = async ({
  data,
}) => {
  if (data.vendor && typeof data.vendor === "object") {
    return { ...data, vendor: data.vendor.id };
  }
  return data;
};

import payload from "payload";
import {
  CollectionAfterReadHook,
  CollectionBeforeValidateHook,
} from "payload/types";

export const afterReadStats: CollectionAfterReadHook = async ({
  doc, // full document data
}) => {
  let vendor = doc.vendor;
  //  if (typeof vendor !== "object") {
  vendor = await payload.findByID({
    id: doc.vendor && doc.vendor.id ? doc.vendor.id : doc.vendor,
    collection: "vendors",
    depth: 0,
  });
  //}

  // const applications = await payload.find({
  //   collection: "applications",
  //   depth: 0,
  //   where: { vendor: { equals: vendor.id } },
  // });

  let reviewScore = 0;
  if (doc.reviews && doc.reviews.length && typeof doc.reviews[0] === "string") {
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
    reviewScore = total / doc.reviews.length;
  }

  let season = doc.season;
  if (season && typeof season !== "object") {
    season = await payload.findByID({
      id: doc.season,
      collection: "seasons",
      depth: 0,
    });
  }
  console.log("***season", season);
  let gaps = [];
  if (season && season.productGaps) {
    gaps = doc.products.reduce((acc, product) => {
      const productId =
        product && product.id !== undefined ? product.id : product;
      if (
        Array.isArray(season.productGaps) &&
        season.productGaps.map((gap: any) => gap.id).includes(productId)
      ) {
        acc.push(product);
      }
      return acc;
    }, []);
  }
  if (gaps.length) {
    const products = await payload.find({
      collection: "products",
      depth: 0,
      where: { id: { in: gaps.join(",") } },
    });
    gaps = products.docs;
  }
  return {
    ...doc,
    vendorName: vendor.name,
    vendorType: vendor.type,
    vendorStanding: vendor.standing,
    vendorDemographics: vendor.demographics,
    gapsMet: gaps,
    reviewScore,
    seasonName: season && season.name ? season.name : "",
    //numberOfMarkets: Array.isArray(applications) ? applications.length : 1,
  };
};

export const beforeValidateStats: CollectionBeforeValidateHook = async ({
  data,
}) => {
  if (data.vendor && typeof data.vendor === "object") {
    return { ...data, vendor: data.vendor.id };
  }
  return data;
};

import payload from "payload";
import {
  CollectionAfterReadHook,
  CollectionBeforeValidateHook,
} from "payload/types";

export const afterReadStats: CollectionAfterReadHook = async ({
  context,
  doc, // full document data
}) => {
  if (context.skipTrigger) return;
  let vendor = doc.vendor;
  if (typeof vendor !== "object") {
    vendor = await payload.findByID({
      id: doc.vendor && doc.vendor.id ? doc.vendor.id : doc.vendor,
      collection: "vendors",
      depth: 0,
    });
  }

  const applications = await payload.find({
    collection: "applications",
    depth: 0,
    where: {
      and: [
        {
          vendor: { equals: vendor.id },
        },
        {
          "season.marketDates.startDate": { greater_than: new Date() },
        },
      ],
    },
    context: { skipTrigger: true },
  });

  let reviewScore = 0;
  let reviews = [];
  if (doc.reviews?.length) {
    if (typeof doc.reviews[0] === "string") {
      const data = await payload.find({
        collection: "reviews",
        depth: 0,
        where: { id: { in: doc.reviews.join(",") } },
      });
      reviews = data.docs;
    } else if (typeof doc.reviews[0] === "object") {
      reviews = doc.reviews;
    }
    const total = reviews.reduce((acc, review) => {
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
  let gaps = [];

  if (season && season.productGaps && doc.products && doc.products.length) {
    gaps = doc.products.reduce((acc, product) => {
      const productId =
        product && product.id !== undefined ? product.id : product;
      if (
        Array.isArray(season.productGaps) &&
        season.productGaps
          .map((gap: any) => (gap && gap.id !== undefined ? gap.id : gap))
          .includes(productId)
      ) {
        acc.push(productId);
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
    reviews,
    seasonName: season && season.name ? season.name : "",
    numberOfApplications: applications.docs?.length
      ? applications.docs.length
      : 0,
    numberOfMarkets: applications.docs?.length
      ? applications.docs.reduce((acc, app) => {
          if (app.status === "approved") acc += 1;
          return acc;
        }, 0)
      : 0,
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

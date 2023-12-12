import payload from "payload";
import {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from "payload/types";
import type { Review } from "payload/generated-types";

export const afterChangeAddToApplication: CollectionAfterChangeHook = async ({
  doc,
  operation,
}) => {
  console.log("***doc", doc);
  if (operation === "create") {
    const application = await payload.findByID({
      id:
        typeof doc.application === "object"
          ? doc.application.id
          : doc.application,
      collection: "applications",
      depth: 0,
    });
    console.log("***application:", application);

    let reviews: string[] = [];
    if (application.reviews && application.reviews.length) {
      if (typeof application.reviews[0] === "object") {
        reviews = application.reviews.map((review: any) => review.id);
      } else {
        reviews = application.reviews as string[];
      }
    }
    await payload.update({
      id:
        typeof doc.application === "object"
          ? doc.application.id
          : doc.application,
      collection: "applications",
      depth: 0,
      data: {
        reviews: [...reviews, doc.id],
      },
    });
  }
};

export const afterDeleteRemoveFromApplication: CollectionAfterDeleteHook =
  async ({ doc }) => {
    const application = await payload.findByID({
      id:
        typeof doc.application === "object"
          ? doc.application.id
          : doc.application,
      collection: "applications",
      depth: 0,
    });

    if (application.reviews && application.reviews.length) {
      let reviews: string[];
      if (typeof application.reviews[0] === "object") {
        reviews = application.reviews.reduce((acc, review: Review) => {
          if (review.id !== doc.id) {
            acc.push(review.id);
          }
          return acc;
        }, []);
      } else {
        reviews = application.reviews.filter(
          (review) => review !== doc.id,
        ) as string[];
      }
      await payload.update({
        id:
          typeof doc.application === "object"
            ? doc.application.id
            : doc.application,
        collection: "applications",
        depth: 0,
        data: {
          reviews,
        },
      });
    }
  };

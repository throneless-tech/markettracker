import payload from "payload";
import {
  CollectionAfterReadHook,
  CollectionBeforeValidateHook,
} from "payload/types";
import type { Product, Season } from "payload/generated-types";

export const afterReadSeasons: CollectionAfterReadHook = async ({
  doc, // full document data
}) => {
  console.log("***populating Seasons", doc);
  if (doc.seasons && doc.seasons.length && typeof doc.seasons[0] === "string") {
    const seasons = await payload.find({
      collection: "seasons",
      depth: 0,
      where: { id: { in: doc.seasons.join(",") } },
    });
    console.log("***found seasons:", seasons);
    if (
      seasons.docs.length &&
      seasons.docs[0].productGaps &&
      seasons.docs[0].productGaps.length
    ) {
      console.log("***populating product Gaps");
      const productGaps = await payload.find({
        collection: "products",
        depth: 0,
        where: { id: { in: seasons.docs[0].productGaps.join(",") } },
      });
      console.log("***found product Gaps:", productGaps);
      seasons.docs[0].productGaps = productGaps.docs;
    }
    console.log("***final seasons:", seasons.docs);
    return { ...doc, seasons: seasons.docs };
  }
  console.log("***returning plain***");
  return doc;
};

export const beforeValidateSeasons: CollectionBeforeValidateHook = async ({
  data,
}) => {
  if (
    data.seasons &&
    data.seasons.length &&
    typeof data.seasons[0] === "object"
  ) {
    const flattened = await data.seasons.reduce(
      async (acc: string[], season: Season) => {
        if (
          season.productGaps &&
          season.productGaps.length &&
          typeof season.productGaps[0] !== "string"
        ) {
          const flatProducts = season.productGaps.map(
            (product: any) => product.id,
          );
          season.productGaps = flatProducts;
        }
        const existing = await payload.findByID({
          collection: "seasons",
          id: season.id,
        });
        if (existing) {
          acc.push(season.id);
          await payload.update({
            collection: "seasons",
            id: season.id,
            data: season,
          });
        } else {
          await payload.create({
            collection: "seasons",
            data: season,
          });
          acc.push(season.id);
        }
      },
      [],
    );

    return { ...data, seasons: flattened };
  }
};

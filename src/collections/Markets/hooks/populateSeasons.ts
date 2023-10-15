import payload from "payload";
import {
  CollectionAfterReadHook,
  CollectionBeforeValidateHook,
} from "payload/types";
import type { Season } from "payload/generated-types";

export const afterReadSeasons: CollectionAfterReadHook = async ({
  doc, // full document data
}) => {
  if (doc.seasons && doc.seasons.length && typeof doc.seasons[0] === "string") {
    const seasons = await payload.find({
      collection: "seasons",
      depth: 0,
      where: { id: { in: doc.seasons.join(",") } },
    });
    return { ...doc, seasons: seasons.docs };
  }
  return doc;
};

export const beforeValidateSeasons: CollectionBeforeValidateHook = async ({
  data,
}) => {
  if (
    data.seasons && data.seasons.length && typeof data.seasons[0] === "object"
  ) {
    const flattened = await data.seasons.reduce(
      async (acc: string[], season: Season) => {
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

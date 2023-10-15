import payload from "payload";
import { CollectionAfterReadHook } from "payload/types";

export const afterReadSeasons: CollectionAfterReadHook = async ({
  doc, // full document data
}) => {
  console.log("doc:", doc);
  if (doc.seasons.length && typeof doc.seasons[0] === "string") {
    console.log("Fetching seasons");
    const seasons = await payload.find({
      collection: "seasons",
      depth: 0,
      where: { id: { in: doc.seasons.join(",") } },
    });
    return { ...doc, seasons: seasons.docs };
  }
  return doc;
};

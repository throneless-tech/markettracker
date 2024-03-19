import payload from "payload";
import { CollectionAfterChangeHook } from "payload/types";

export const createCollectionSeason: CollectionAfterChangeHook = async (
  props,
) => {
  const { doc, operation } = props;

  // console.log("***createCollection doc", doc);
  if (operation === "create") {
    let market;
    let marketId;
    if (typeof doc.market === "object") {
      market = doc.market;
      marketId = doc.market.id;
    } else {
      marketId = doc.market;
      market = await payload.findByID({
        collection: "markets",
        id: marketId,
        depth: 0,
      });
    }

    if (market.seasons?.length && typeof market.seasons[0] === "object") {
      await payload.update({
        collection: "markets",
        id: marketId,
        data: {
          seasons: [
            ...(market.seasons.map((season) => season.id) || []),
            doc.id,
          ],
        },
      });
    } else {
      await payload.update({
        collection: "markets",
        id: marketId,
        data: {
          seasons: [...(market.seasons || []), doc.id],
        },
      });
    }
  }
  return doc;
};

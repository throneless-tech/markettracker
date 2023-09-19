import payload from "payload";
import { CollectionAfterChangeHook } from "payload/types";

export const createCollectionSeason: CollectionAfterChangeHook = async (
  props,
) => {
  const { doc, operation } = props;

  if (operation === "create") {
    const market = await payload.findByID({
      collection: "markets",
      id: doc.market,
      depth: 0,
    });
    await payload.update({
      collection: "markets",
      id: doc.market,
      data: {
        seasons: [...(market.seasons || []), doc.id],
      },
    });
  }
  return doc;
};

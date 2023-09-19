import payload from "payload";
import { CollectionBeforeChangeHook } from 'payload/types'

export const createSlugField: CollectionBeforeChangeHook = async ({
  data // incoming data to update or create with
}) => {
  console.debug("beforeChangeHook data:", data); // Just for debugging, can be removed once you've confirmed it is working

  const market = await payload.findByID({ collection: "markets", id: data.market })

  return { ...data, name: data.name + '-' + market.name }; // Return data to update the document with
}
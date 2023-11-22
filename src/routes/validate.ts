import type { Vendor } from "payload/generated-types";
const validateRoute = async (req, res, next) => {
  console.log("***req.params", req.params);
  if (req.params.id) {
    try {
      let vendor: Vendor = await req.payload.findByID({
        collection: "vendors",
        id: req.params.id,
        depth: 0,
      });
      if (!vendor || !vendor.id) throw new Error("Failed to find vendor");
      vendor = await req.payload.update({
        collection: "vendors",
        id: req.params.id,
        data: vendor,
      });
      console.log("***vendor", vendor);
      res.status(200).send({ vendor });
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  } else {
    res.status(400).send({ error: "Needs vendor ID" });
  }
};

export { validateRoute };

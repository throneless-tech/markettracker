import { User, Vendor } from "payload/generated-types";
const registerRoute = async (req, res, next) => {
  console.log("***req.body", req.body);
  if (req.body.user && req.body.vendor) {
    try {
      const vendor: Vendor = req.payload.create({
        collection: "vendors",
        data: req.body.vendor,
      });
      const user: User = req.payload.create({
        collection: "users",
        data: { ...req.body.user, vendor: vendor.id },
      });
      res.status(201).send({ user, vendor });
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  } else {
    res.status(400).send({ error: "Needs both user and vendor" });
  }
};

export { registerRoute };

import { User, Vendor } from "payload/generated-types";
const registerRoute = async (req, res, next) => {
  console.log("***req.body", req.body);
  if (req.body.user && req.body.vendor) {
    try {
      const user: User = await req.payload.create({
        collection: "users",
        data: { ...req.body.user, role: "vendor" },
      });
      // console.log("***user", user);
      if (!user) throw new Error("Failed to create user");
      const vendor: Vendor = await req.payload.create({
        collection: "vendors",
        data: { ...req.body.vendor, user: user.id },
      });
      // console.log("***vendor", vendor);
      if (!vendor || !vendor.id) throw new Error("Failed to create vendor");
      const updated = await req.payload.update({
        id: user.id,
        collection: "users",
        data: { vendor: vendor.id },
      });
      // console.log("***updated", updated);
      res.status(201).send({ user, vendor });
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  } else {
    res.status(400).send({ error: "Needs both user and vendor" });
  }
};

export { registerRoute };

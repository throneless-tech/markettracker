import type { User } from "payload/generated-types";
const emailRoute = async (req, res, next) => {
  console.log("***req.params", req.params);
  if (req.params.id) {
    try {
      let user: User = await req.payload.findByID({
        collection: "users",
        id: req.params.id,
        depth: 0,
      });
      if (!user || !user.id || !user.email)
        throw new Error("Failed to find vendor");

      console.log("***body", req.body);
      res.status(200).send({ body: "emailed" });
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  } else {
    res.status(400).send({ error: "Needs vendor ID" });
  }
};

export { emailRoute };

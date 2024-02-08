import qs from "qs";
import { Vendor } from "payload/generated-types";

// gets a vendor user's approved markets & dates
const getSeasons = async (user) => {
  const marketsQuery = {
    vendor: {
      equals:
        user.vendor && typeof user.vendor === "object"
          ? (user.vendor as Vendor).id
          : user.vendor,
    },
    status: {
      equals: "approved",
    },
  };

  const stringQuery = qs.stringify(
    {
      where: marketsQuery,
      depth: 1,
    },
    { addQueryPrefix: true },
  );

  const response = await fetch(`/api/applications${stringQuery}`);
  const json = await response.json();
  const applications = json ? json.docs : [];
  const seasons = [];

  applications.map((app) => {
    const dates = {
      [app.season.id]: app.dates,
    };

    return seasons.push({
      season: app.season,
      dates,
    });
  });

  return seasons;
};

export default getSeasons;

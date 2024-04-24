import payload from "payload";
import {
  CollectionAfterReadHook,
  CollectionBeforeValidateHook,
} from "payload/types";
import type { MarketReport } from "payload/generated-types";

const days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

// do not show markets that have ended
const isSeasonCurrent = (endDate) => {
  let today = new Date();
  const date = new Date(endDate);

  return today < date ? true : false;
};

// return an array of dates that each season has market reports
// either in progress or not yet created
const seasonDates = (dayOfWeek, startDate, endDate) => {
  let dates = [];
  let today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  const marketDay = days.findIndex((day) => day === dayOfWeek);

  while (start <= end && start <= today) {
    if (start.getDay() === marketDay) {
      dates.push(new Date(start));
    }
    start.setDate(start.getDate() + 1);
  }

  return dates;
};

export const afterReadMarketReports: CollectionAfterReadHook = async ({
  doc, // full document data
}) => {
  const marketReports = await payload.find({
    collection: "market-reports",
    depth: 0,
    where: { season: { equals: doc.id } },
  });
  let season = doc;

  if (isSeasonCurrent(doc.marketDates.endDate)) {
    if (doc.market && typeof doc.market === "object") {
      const seasonMarketReports = seasonDates(
        doc.market.days[0],
        doc.marketDates.startDate,
        doc.marketDates.endDate,
      );
      season = { ...season, seasonDates: seasonMarketReports };
    }
  }
  if (marketReports) {
    season = { ...season, marketReports: marketReports.docs };
  }

  return season;
};

export const beforeValidateMarketReports: CollectionBeforeValidateHook =
  async ({ data }) => {
    if (
      data.productGaps &&
      data.productGaps.length &&
      typeof data.productGaps[0] === "object"
    ) {
      return {
        ...data,
        marketReports: data.marketReports.map(
          (report: MarketReport) => report.id,
        ),
      };
    }

    return data;
  };

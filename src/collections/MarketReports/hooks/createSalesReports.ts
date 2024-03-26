import payload from "payload";
import { CollectionAfterChangeHook } from "payload/types";

export const createSalesReports: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {
  if (operation === "update") {
    /***
         * doc is the market report that's been created
         * with the Vendor attendance
         *         *
         *
         * if the Vendor has attendance status of "present" or "late",
         * pull their info and create a sales report for that vendor:
         * needs vendorId, seasonId, date of market
         * 
  "vendorAttendance": {
    "vendorAttendance": [
      {
        "id": "6601d1afbe06f7406422ee1d",
        "status": "absent",
        "vendor": "65091f8098eb505c5b95a0c7"
      },
      {
        "id": "6601e78819a862273ccea0d0",
        "status": "present",
        "vendor": "65091f8198eb505c5b95a0dc"
      },
      {
        "id": "6601e78819a862273ccea0d1",
        "status": "present",
        "vendor": "65091f8198eb505c5b95a0f1"
      },
      {
        "id": "6601e78c19a862273ccea0d3",
        "status": "present",
        "vendor": "65091f8398eb505c5b95a130"
      },
      {
        "id": "6601e78c19a862273ccea0d4",
        "status": "present",
        "vendor": "65091f8998eb505c5b95a295"
      },
      {
        "id": "6601e78f19a862273ccea0d5",
        "status": "present",
        "vendor": "65091f8798eb505c5b95a217"
      },
      {
        "id": "6601e79219a862273ccea0d6",
        "status": "present",
        "vendor": "65091f8c98eb505c5b95a328"
      }
    
         *
         */

    if (doc._status == "published" && doc.vendorAttendance.vendorAttendance) {
      const attendanceArray = doc.vendorAttendance.vendorAttendance;
      const attended = [];
      attendanceArray.forEach((vendor) => {
        if (vendor.status === "present" || vendor.status === "late") {
          attended.push(vendor.vendor);
        }
      });

      if (attended.length) {
        for (const vendorId of attended) {
          try {
            await req.payload.create({
              collection: "sales-reports",
              data: {
                season: doc.season.id,
                vendor: vendorId,
                day: doc.date,
              },
            });
          } catch (err) {
            console.error("Error creating sales reports: ", err);
          }
        }
      }
    }
    return doc;
  }
};

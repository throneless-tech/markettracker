import payload from "payload";
import {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from "payload/types";
import type { Application } from "payload/generated-types";

export const afterChangeAddToVendor: CollectionAfterChangeHook = async ({
  doc,
  operation,
}) => {
  console.log("***doc", doc);
  if (operation === "create") {
    const vendor = await payload.findByID({
      id: doc.vendor.id,
      collection: "vendors",
      depth: 0,
    });
    console.log("***vendor:", vendor);

    let applications: string[] = [];
    if (vendor.applications && vendor.applications.length) {
      if (typeof vendor.applications[0] === "object") {
        applications = vendor.applications.map((review: any) => review.id);
      } else {
        applications = vendor.applications as string[];
      }
    }
    await payload.update({
      id: doc.vendor.id,
      collection: "vendors",
      depth: 0,
      data: {
        applications: [...applications, doc.id],
      },
    });
  }
  return doc;
};

export const afterDeleteRemoveFromVendor: CollectionAfterDeleteHook = async ({
  doc,
}) => {
  const vendor = await payload.findByID({
    id: doc.vendor.id,
    collection: "vendors",
    depth: 0,
  });

  if (vendor.applications && vendor.applications.length) {
    let applications: string[];
    if (typeof vendor.applications[0] === "object") {
      applications = vendor.applications.reduce((acc, app: Application) => {
        if (app.id !== doc.id) {
          acc.push(app.id);
        }
        return acc;
      }, []);
    } else {
      applications = vendor.applications.filter(
        (app) => app !== doc.id,
      ) as string[];
    }
    await payload.update({
      id: doc.vendor.id,
      collection: "vendors",
      depth: 0,
      data: {
        applications,
      },
    });
  }
  return doc;
};

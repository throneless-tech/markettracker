import { buildConfig } from "payload/config";
import path from "path";
// import Examples from './collections/Examples';
import { Applications } from "./collections/Applications";
import { Contacts } from "./collections/Contacts";
import { Documents } from "./collections/Documents";
import { Invoices } from "./collections/Invoices";
import { MarketReports } from "./collections/MarketReports";
import { Markets } from "./collections/Markets";
import { Media } from "./collections/Media";
import { Products } from "./collections/Products";
import { SalesReports } from "./collections/SalesReports";
import { Seasons } from "./collections/Seasons";
import { Vendors } from "./collections/Vendors";

import CustomDashboard from "./components/CustomDashboard";

export default buildConfig({
  serverURL: "http://localhost:3000",
  admin: {
    // user: Users.slug,
    components: {
      views: {
        Dashboard: CustomDashboard,
      },
    },
  },
  collections: [
    Applications,
    Contacts,
    Documents,
    Invoices,
    MarketReports,
    Markets,
    Media,
    Products,
    SalesReports,
    Seasons,
    Vendors,
    // Add Collections here
    // Examples,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
});

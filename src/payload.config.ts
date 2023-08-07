import { buildConfig } from "payload/config";
import path from "path";
// import Examples from './collections/Examples';
import { Vendors } from "./collections/Vendors";

import CustomDashboard from "./components/CustomDashboard";

export default buildConfig({
  serverURL: "http://localhost:3000",
  admin: {
    // user: Users.slug,
    components: {
      views: {
        Dashboard: CustomDashboard
      }
    }
  },
  collections: [
    Vendors,
    // Markets,
    // Instances,
    // Applications,
    // Days,
    // Invoices,
    // SalesReports,
    // MarketReports,
    // Products,
    // Supplies,
    // Reports,
    // Coupons,
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

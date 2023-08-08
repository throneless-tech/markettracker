import { buildConfig } from "payload/config";
import path from "path";
// import Examples from './collections/Examples';
import { Applications } from "./collections/Applications";
import { Appointments } from "./collections/Appointments";
import { Contacts } from "./collections/Contacts";
import { Days } from "./collections/Days";
import { SalesReports } from "./collections/SalesReports";
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
    // Markets,
    // Instances,
    Applications,
    Appointments,
    Contacts,
    Days,
    // Invoices,
    SalesReports,
    // MarketReports,
    // Products,
    // Supplies,
    // Reports,
    // Coupons,
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

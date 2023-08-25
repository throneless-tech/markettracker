import { buildConfig } from "payload/config";
import path from "path";
// import Examples from './collections/Examples';
import { Applications } from "./collections/Applications";
import { Appointments } from "./collections/Appointments";
import { Contacts } from "./collections/Contacts";
import { Coupons } from "./collections/Coupons";
import { Days } from "./collections/Days";
import { Instances } from "./collections/Instances";
import { Invoices } from "./collections/Invoices";
import { MarketReports } from "./collections/MarketReports";
import { Markets } from "./collections/Markets";
import { Products } from "./collections/Products";
import { SalesReports } from "./collections/SalesReports";
import { Supplies } from "./collections/Supplies";
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
    Appointments,
    Contacts,
    Coupons,
    Days,
    Instances,
    Invoices,
    MarketReports,
    Markets,
    Products,
    SalesReports,
    Supplies,
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

import { buildConfig } from "payload/config";
import { payloadCloud } from "@payloadcms/plugin-cloud";
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
import { Supplies } from "./collections/Supplies";
import { Vendors } from "./collections/Vendors";

import CustomDashboard from "./components/CustomDashboard";
import CustomNav from "./components/CustomNav";
import CustomLogo from "./icons/logo";

export default buildConfig({
  admin: {
    // user: Users.slug,
    css: path.resolve(__dirname, "styles/main.scss"),
    components: {
      graphics: {
        Icon: CustomLogo,
        Logo: CustomLogo,
      },
      Nav: CustomNav,
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
    Supplies,
    Vendors,
    // Add Collections here
    // Examples,
  ],
  plugins: [payloadCloud()],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
});

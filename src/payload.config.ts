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
import { Supplies} from "./collections/Supplies";
import { Vendors } from "./collections/Vendors";

import CustomAccount from "./components/CustomAccount";
import CustomBeforeLogin from "./components/CustomBeforeLogin";
import CustomDashboard from "./components/CustomDashboard";
import CustomProvider from "./styles/themeProvider";
import CustomNav from "./components/CustomNav";
import CustomLogo from "./assets/icons/logo";

export default buildConfig({
  serverURL: "http://localhost:3000",
  admin: {
    // user: Users.slug,
    css: path.resolve(__dirname, 'styles/main.scss'),
    components: {
      // BeforeLogin: CustomBeforeLogin,
      graphics: {
        Icon: CustomLogo,
        Logo: CustomLogo,
      },
      Nav: CustomNav,
      providers: [CustomProvider],
      views: {
        Account: CustomAccount,
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
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
});

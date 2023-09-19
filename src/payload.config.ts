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
import { Reviews } from "./collections/Reviews";
import { SalesReports } from "./collections/SalesReports";
import { Seasons } from "./collections/Seasons";
import { Supplies } from "./collections/Supplies";
import { Users } from "./collections/Users";
import { Vendors } from "./collections/Vendors";

import CustomAccount from "./components/CustomAccount";
import CustomAfterLogin from "./components/CustomAfterLogin";
import CustomApplications from "./components/CustomApplications";
import CustomBeforeLogin from "./components/CustomBeforeLogin";
import CustomDashboard from "./components/CustomDashboard";
import CustomLogo from "./components/CustomLogo";
import CustomLogoutButton from "./components/CustomLogoutButton";
import CustomProvider from "./styles/themeProvider";
import CustomNav from "./components/CustomNav";
import CustomIcon from "./assets/icons/logo";

export default buildConfig({
  //serverURL: "http://locahost:3000",
  admin: {
    user: Users.slug,
    css: path.resolve(__dirname, "styles/main.scss"),
    components: {
      // beforeLogin: [CustomBeforeLogin],
      // afterLogin: [CustomAfterLogin],
      graphics: {
        Icon: CustomIcon,
        Logo: CustomLogo,
      },
      logout: {
        // Button: CustomLogoutButton,
      },
      Nav: CustomNav,
      providers: [CustomProvider],
      routes: [
        {
          Component: CustomApplications,
          path: '/markets/applications/:id'
        }
      ],
      views: {
        Account: CustomAccount,
        Dashboard: CustomDashboard,
      },
    },
    meta: {
      titleSuffix: "• Market Tracker",
      favicon: "/assets/icons/logos/ff-mark.svg",
      ogImage: "/assets/icons/logos/ff-mark.svg",
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
    Reviews,
    SalesReports,
    Seasons,
    Supplies,
    Users,
    Vendors,
    // Add Collections here
    // Examples,
  ],
  cors: ["*", "https://markettracker.payloadcms.app"],
  debug: true,
  plugins: [payloadCloud()],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
});

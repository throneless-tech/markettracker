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

// custom components
import CustomAccount from "./components/CustomAccount";
import CustomAfterLogin from "./components/CustomAfterLogin";
import CustomApplications from "./components/CustomApplications";
import CustomApply from "./components/CustomApply";
import CustomBeforeLogin from "./components/CustomBeforeLogin";
import CustomDashboard from "./components/CustomDashboard";
import CustomLogo from "./components/CustomLogo";
import CustomLogoutButton from "./components/CustomLogoutButton";
import CustomProvider from "./styles/themeProvider";
import CustomNav from "./components/CustomNav";
import Register from "./components/Register";

// utils
import { withFormContext } from "./utils/withFormContext";

// icons
import CustomIcon from "./assets/icons/logo";

const createCollectionDocumentPath = path.resolve(
  __dirname,
  "collections/Documents/hooks/createCollectionDocument",
);

const mockModulePath = path.resolve(__dirname, "mocks/emptyObject.js");

export default buildConfig({
  //serverURL: "http://locahost:3000",
  admin: {
    user: Users.slug,
    css: path.resolve(__dirname, "styles/main.scss"),
    components: {
      beforeLogin: [CustomBeforeLogin],
      afterLogin: [CustomAfterLogin],
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
          path: '/collections/markets/applications/:id'
        },
        {
          Component: CustomApply,
          path: '/collections/markets/:id/apply',
        },
        // {
        //   Component: Register,
        //   path: '/register'
        // }
      ],
      views: {
        Account: withFormContext(CustomAccount),
        Dashboard: CustomDashboard,
      },
    },
    meta: {
      titleSuffix: "• Market Tracker",
      favicon: "/assets/icons/logos/ff-mark.svg",
      ogImage: "/assets/icons/logos/ff-mark.svg",
    },
    webpack: (config) => ({
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          [createCollectionDocumentPath]: mockModulePath,
        },
      },
    }),
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
});

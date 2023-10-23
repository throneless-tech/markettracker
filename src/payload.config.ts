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
import { Account } from "./components/Base/Account";
import { AfterLogin } from "./components/Base/AfterLogin";
import { BeforeLogin } from "./components/Base/BeforeLogin";
import { Dashboard } from "./components/Base/Dashboard";
import { Logo } from "./components/Base/Logo";
import { LogoutButton } from "./components/Base/LogoutButton";
import { Nav } from "./components/Base/Nav";
import { ThemeProvider } from "./styles/ThemeProvider";
import { Register } from "./components/Base/Register";

// utils
import { withAccountContext } from "./utils/withAccountContext";

// icons
import Icon from "./assets/icons/logo";

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
      beforeLogin: [BeforeLogin],
      afterLogin: [AfterLogin],
      graphics: {
        Icon: Icon,
        Logo: Logo,
      },
      logout: {
        // Button: CustomLogoutButton,
      },
      Nav: Nav,
      providers: [ThemeProvider],
      routes: [
        {
          Component: Register,
          path: "/register",
        },
      ],
      views: {
        Account: withAccountContext(Account),
        Dashboard: Dashboard,
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

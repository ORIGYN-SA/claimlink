import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Dashboardcontainer from "../pages/Dashboardcontainer";
import Dispensers from "../pages/Dispensers";
import CreateDispensers from "../components/dispensers/CreateDispenser";
import DispenserSetup from "../components/dispensers/DispenserSetup";
import CreateDispenser from "../components/dispensers/CreateDispenser";
import CampaignSetup from "../components/claimlink/CampaignSetup";
import ClaimPattern from "../components/claimlink/ClaimPattern";
import DistributionPage from "../components/claimlink/DistributionPage";

const approutes = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/claim-link",
    element: (
      <Dashboard>
        <Dashboardcontainer />
      </Dashboard>
    ),
  },
  {
    path: "/dispensers",
    element: (
      <Dashboard>
        <Dispensers />
      </Dashboard>
    ),
  },
  {
    path: "/create-dispenser",
    element: (
      <Dashboard>
        <CreateDispenser />
      </Dashboard>
    ),
  },
  {
    path: "/dispenser-setup",
    element: (
      <Dashboard>
        <DispenserSetup />
      </Dashboard>
    ),
  },
  {
    path: "/campaign-setup",
    element: (
      <Dashboard>
        <CampaignSetup />
      </Dashboard>
    ),
  },
  {
    path: "/claim-pattern",
    element: (
      <Dashboard>
        <ClaimPattern />
      </Dashboard>
    ),
  },
  {
    path: "/distribution",
    element: (
      <Dashboard>
        <DistributionPage />
      </Dashboard>
    ),
  },
]);

export default approutes;

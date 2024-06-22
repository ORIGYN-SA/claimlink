import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Dashboardcontainer from "../pages/Dashboardcontainer";
import Dispensers from "../pages/Dispensers";
import CreateDispensers from "../components/dispensers/CreateDispenser";
import DispenserSetup from "../components/dispensers/DispenserSetup";
import CreateDispenser from "../components/dispensers/CreateDispenser";

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
]);

export default approutes;

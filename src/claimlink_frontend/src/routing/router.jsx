import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Dashboardcontainer from "../pages/Dashboardcontainer";
import Dispensers from "../pages/Dispensers";
import CreateDispensers from "../components/dispensers/CreateDispenser";
import DispenserSetup from "../components/dispensers/DispenserSetup";
import CreateDispenser from "../components/dispensers/CreateDispenser";
import CampaignSetup from "../components/claimlink/CampaignSetup";
import ClaimPattern from "../components/claimlink/ClaimPattern";
import DistributionPage from "../components/minter/DistributionPage";
import Minter from "../pages/Minter";
import SelectContractType from "../components/minter/SelectContractType";
import CollectionSetup from "../components/minter/CollectionSetup";
import AddToken from "../components/minter/AddToken";
import AddTokenHome from "../components/minter/AddTokenHome";
import Launch from "../components/claimlink/Launch";
import TestCampaign from "../components/claimlink/TestCampaign";
import QrManager from "../components/qrManager/QrManager";
import QrSetup from "../components/qrManager/QrSetup";
import QRSetForm from "../components/qrManager/NewQrSet";
import DistributionPages from "../components/minter/DistributionPages";
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
      <Dashboard headerText={"good"} menubar={false}>
        <Dispensers />
      </Dashboard>
    ),
  },
  {
    path: "/dispensers/create-dispenser",
    element: (
      <Dashboard>
        <CreateDispenser />
      </Dashboard>
    ),
  },
  {
    path: "/dispensers/dispenser-setup",
    element: (
      <Dashboard stepper={true} headerText={"New dispeser"} menubar={false}>
        <DispenserSetup />
      </Dashboard>
    ),
  },
  {
    path: "/claim-link/launch",
    element: (
      <Dashboard>
        <Launch />
      </Dashboard>
    ),
  },
  {
    path: "/claim-link/test-campaign",
    element: (
      <Dashboard>
        <TestCampaign />
      </Dashboard>
    ),
  },
  {
    path: "/campaign-setup",
    element: (
      <Dashboard stepper={true}>
        <CampaignSetup />
      </Dashboard>
    ),
  },
  {
    path: "/minter",
    element: (
      <Dashboard>
        <Minter />
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
    path: "/minter/new-contract",
    element: (
      <Dashboard stepper={true}>
        <SelectContractType />
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
  {
    path: "/qr-manager",
    element: (
      <Dashboard>
        <QrManager />
      </Dashboard>
    ),
  },
  {
    path: "/qr-setup",
    element: (
      <Dashboard>
        <QrSetup />
      </Dashboard>
    ),
  },
  {
    path: "/new-qr-setup",
    element: (
      <Dashboard>
        <QRSetForm />
      </Dashboard>
    ),
  },
  {
    path: "/minter/new-contract/collection-setup",
    element: (
      <Dashboard stepper={true}>
        <CollectionSetup />
      </Dashboard>
    ),
  },
  {
    path: "/minter/new-contract/token-home",
    element: (
      <Dashboard>
        <AddTokenHome />
      </Dashboard>
    ),
  },
  {
    path: "/minter/new-contract/token-home/add-token",
    element: (
      <Dashboard>
        <AddToken />
      </Dashboard>
    ),
  },
  {
    path: "/minter/new-contract/token-home/distribution-setup",
    element: (
      <Dashboard stepper={true} headerText={"Test campaign"} menubar={false}>
        <DistributionPages />
      </Dashboard>
    ),
  },
]);

export default approutes;

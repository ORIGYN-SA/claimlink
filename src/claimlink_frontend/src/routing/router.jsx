import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Dashboardcontainer from "../pages/Dashboardcontainer";
import Dispensers from "../pages/Dispensers";
import CreateDispensers from "../components/dispensers/CreateDispenser";
import DispenserSetup from "../components/dispensers/DispenserSetup";
import CreateDispenser from "../components/dispensers/CreateDispenser";
import CampaignSetup from "../components/claimlink/CampaignSetup";
import ClaimPattern from "../components/claimlink/ClaimPattern";
import DistributionPage from "../components/DistributionPage";
import Minter from "../pages/Minter";
import SelectContractType from "../components/minter/SelectContractType";
import CollectionSetup from "../components/minter/CollectionSetup";
import AddToken from "../components/minter/AddToken";
import AddTokenHome from "../components/minter/AddTokenHome";
import Launch from "../components/claimlink/Launch";
import TestCampaign from "../components/claimlink/TestCampaign";
import QrManager from "../pages/QrManager";
import QrSetup from "../components/qrManager/QrSetup";
import QRSetForm from "../components/qrManager/NewQrSet";
import DistributionPages from "../components/minter/DistributionPages";
import LoginPage from "../components/LoginPage";
import Contract from "../components/minter/Contract";
const approutes = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/claim-link",
    element: (
      <Dashboard stepper={false} headerText={"Test Campaign"} menubar={false}>
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
      <Dashboard stepper={true}>
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
      <Dashboard stepper={true}>
        <ClaimPattern />
      </Dashboard>
    ),
  },
  {
    path: "/minter/new-contract",
    element: (
      <Dashboard stepper={true}>
        <Contract />
      </Dashboard>
    ),
  },
  {
    path: "/distribution",
    element: (
      <Dashboard stepper={true}>
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
      <Dashboard stepper={true}>
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
  // {
  //   path: "/minter/new-contract/collection-setup",
  //   element: (
  //     <Dashboard stepper={true}>
  //       <CollectionSetup />
  //     </Dashboard>
  //   ),
  // },
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

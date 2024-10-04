import React, { useState } from "react";
import { useAuthClient } from "../connect/useAuthClient";

const NfidWallet = () => {
  const { isConnected, login, logout, principal, backend } = useAuthClient(); // Access auth state

  return (
    <div>
      {!isConnected ? (
        // Show connect wallet button if not connected
        <button onClick={login} className="bg-blue-500 text-white p-2 rounded">
          Connect Wallet
        </button>
      ) : (
        // Show custom connected wallet button if connected
        <CustomConnectedWalletButton
          connectedAccount={principal.toText()}
          icpBalance={0} // Assuming ICP balance fetching is implemented elsewhere
          onDisconnect={logout}
        />
      )}
    </div>
  );
};

export default NfidWallet;

import * as Menu from "@radix-ui/react-dropdown-menu";
import { ConnectedWalletButton } from "@nfid/identitykit/react";

const CustomConnectedWalletButton = ({
  connectedAccount,
  icpBalance,
  onDisconnect,
}) => {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <ConnectedWalletButton>{`Disconnect ${connectedAccount} ${icpBalance} ICP`}</ConnectedWalletButton>
      </Menu.Trigger>
      <Menu.Content>
        <Menu.Item>
          <button
            onClick={onDisconnect}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-700"
          >
            Disconnect Wallet
          </button>
        </Menu.Item>
      </Menu.Content>
    </Menu.Root>
  );
};

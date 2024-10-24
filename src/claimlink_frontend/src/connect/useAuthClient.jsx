import { ConnectedWalletButton } from "@nfid/identitykit/react";
import { createContext, useContext } from "react";

const AuthenticationContext = createContext();

export default function useAuthentication() {
  const login = ({ connectedAccount, icpBalance, ...props }) => (
    <ConnectedWalletButton {...props}>
      {`Disconnect ${connectedAccount} ${icpBalance} ICP`}
    </ConnectedWalletButton>
  );

  return { login };
}

export const AuthenticationProvider = ({ children }) => {
  const authentication = useAuthentication();
  console.log("Auth is ", authentication);
  return (
    <AuthenticationContext.Provider value={authentication}>
      {children}
    </AuthenticationContext.Provider>
  );
};

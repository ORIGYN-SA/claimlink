import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./connect/useClient";
import { Provider } from "react-redux";
import { store } from "./redux/app/store";
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    {/* <AuthProvider> */}
    <App />
    {/* </AuthProvider> */}
  </Provider>
);

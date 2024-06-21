import { useState } from "react";
import { claimlink_backend } from "declarations/claimlink_backend";
import approutes from "./routing/router";
import { RouterProvider } from "react-router-dom";

function App() {
  return (
    <main>
      <RouterProvider router={approutes} />
    </main>
  );
}

export default App;

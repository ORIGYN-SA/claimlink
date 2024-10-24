import { useState } from "react";
import { claimlink_backend } from "declarations/claimlink_backend";
import approutes from "./routing/router";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { DialogContent, DialogTitle } from "@radix-ui/react-dialog";

function App() {
  return (
    <main>
      <RouterProvider router={approutes} />
      <Toaster />
    </main>
  );
}

export default App;

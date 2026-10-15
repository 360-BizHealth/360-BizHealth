import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/poppins/latin-600.css";
import "@fontsource/poppins/latin-700.css";
import "./styles/global.css";

/* Old single-file site used hash URLs (#/about). Map them to real paths. */
if (window.location.hash.startsWith("#/")) {
  window.history.replaceState(null, "", window.location.hash.slice(1));
}

const root = document.getElementById("root");
const app = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

/* Prerendered pages are hydrated; the 404 shell and /admin render on the client. */
if (root.hasChildNodes() && root.dataset.prerendered === "true") hydrateRoot(root, app);
else createRoot(root).render(app);

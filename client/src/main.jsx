import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// All components and pages have been converted to Tailwind CSS
// CSS imports removed - using Tailwind CSS utility classes instead
import App from "./App";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
    <ToastContainer position="bottom-right" />
  </React.StrictMode>
);

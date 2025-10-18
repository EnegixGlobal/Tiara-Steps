import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// Import all critical CSS files at the top level
import "./styles/navbar.css";
import "./styles/landingpage.css";
import "./styles/products.css";
import "./styles/productDetails.css";
import "./styles/cartlayout.css";
import "./styles/contactpage.css";
import "./styles/auth.css";
import "./styles/adminDashboard.css";
import "./styles/order.css";
import App from "./App";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "../context/AuthProvider";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <ToastContainer position="bottom-right" />
    </AuthProvider>
  </React.StrictMode>
);

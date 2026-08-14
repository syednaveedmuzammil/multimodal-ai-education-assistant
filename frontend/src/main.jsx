import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import App from "./App";

import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>

      {/* Global Toast Notifications */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 3000,

          style: {
            background: "#1E293B",
            color: "#F8FAFC",
            border: "1px solid #334155",
            borderRadius: "12px"
          },

          success: {
            iconTheme: {
              primary: "#22C55E",
              secondary: "#ffffff"
            }
          },

          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#ffffff"
            }
          }
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ClerkProvider } from "@clerk/react";
import { ApiProvider } from "./ApiContext";
import { enUS } from "@clerk/localizations";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

const localization = {
  ...enUS, // Spread the original English strings
  unstable__errors: {
    ...enUS.unstable__errors, // Spread original error codes
    form_password_incorrect: "Something went wrong.",
  },
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider
      localization={localization}
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      appearance={{
        elements: {
          // This targets the full-screen overlay
          modalBackdrop: {
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black
            backdropFilter: "blur(4px)", // Optional: adds a blur effect
          },
          // This targets the actual modal box
          modalContent: {
            borderRadius: "12px",
          },
        },
      }}
    >
      <ApiProvider>
        <App />
      </ApiProvider>
    </ClerkProvider>
  </StrictMode>,
);

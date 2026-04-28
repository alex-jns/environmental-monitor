// React imports
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// CSS style
import "./index.css";

// The main application
import App from "./App.tsx";

// Handles API calls from backend
import { ApiProvider } from "./ApiContext";

// Clerk Auth provider imports
import { ClerkProvider } from "@clerk/react";
import { enUS } from "@clerk/localizations";

// Loads the Clerk key from environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// App won't run without it
if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

// Overwrite "password incorrect" for better security
const localization = {
  ...enUS,
  unstable__errors: {
    ...enUS.unstable__errors,
    form_password_incorrect: "Something went wrong.",
  },
};

// Mount the application to index.html
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

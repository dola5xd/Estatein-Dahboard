import { BrowserRouter, useRoutes } from "react-router";
import { routes } from "./routes";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "react-hot-toast";

const AppRoutes = () => useRoutes(routes);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 5000,
        style: {
          background: "var(--background)",
          fontWeight: "700",
          padding: "20px 10px",
          fontSize: "1rem",
        },

        success: {
          style: {
            color: "var(--color-primary-600)",
          },
          iconTheme: {
            primary: "var(--color-primary-600)",
            secondary: "#1e293b",
          },
        },
        error: {
          style: {
            color: "#ef4444",
          },
          iconTheme: {
            primary: "#ef4444",
            secondary: "#1e293b",
          },
        },
        loading: {
          duration: Infinity,

          style: {
            color: "#fff",
          },
          iconTheme: {
            primary: "var(--color-primary-600)",
            secondary: "#1e293b",
          },
        },
      }}
    />
  </QueryClientProvider>
);

export default App;

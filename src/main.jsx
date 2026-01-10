import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style/global_style.css";
import App from "./App.jsx";
import ThemeProvider from "./context/ThemeProvider.jsx";
import { HistoryProvider } from "./context/HistoryContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { WatchLaterProvider } from "./context/WatchLaterContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <HistoryProvider>
          <WishlistProvider>
            <WatchLaterProvider>
              <App />
            </WatchLaterProvider>
          </WishlistProvider>
        </HistoryProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);

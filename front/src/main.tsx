  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import { AppProvider } from "./app/context/AppContext.tsx";
  import "./app/i18n.ts";
  import "./styles/index.css";
  import "leaflet/dist/leaflet.css";

  createRoot(document.getElementById("root")!).render(
    <AppProvider>
      <App />
    </AppProvider>
  );
  

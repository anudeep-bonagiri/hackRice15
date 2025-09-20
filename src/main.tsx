import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";

const domain = import.meta.env.VITE_AUTH0_DOMAIN!;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID!;

// Debug Auth0 config
console.log('Auth0 Config:', {
  domain,
  clientId,
  redirectUri: `${window.location.origin}/callback`
});

createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: `${window.location.origin}/callback`,
      scope: "openid profile email"
    }}
    useRefreshTokens={true}
    cacheLocation="localstorage"
    onRedirectCallback={(appState) => {
      console.log('Auth0 redirect callback:', appState);
      // Redirect to dashboard or intended page after auth
      window.location.replace(appState?.returnTo || '/dashboard');
    }}
  >
    <App />
  </Auth0Provider>
);

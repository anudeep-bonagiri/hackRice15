import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";

const domain = import.meta.env.VITE_AUTH0_DOMAIN!;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID!;

// Dynamic redirect URI based on current environment
const getRedirectUri = () => {
  const origin = window.location.origin;
  return `${origin}/callback`;
};

const redirectUri = getRedirectUri();

// Debug Auth0 config
console.log('Auth0 Config:', {
  domain,
  clientId,
  redirectUri,
  currentOrigin: window.location.origin,
  environment: import.meta.env.MODE
});

createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: redirectUri,
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

import config from "~/config.js";
import authService from "~/services/auth.service.js";
import { toast } from "sonner";

/**
 * Alternative Microsoft OAuth implementation for cases where:
 * 1. Cannot modify Azure App Registration settings
 * 2. App is configured as "Web" type instead of "SPA"
 * 3. Need to work with existing NextAuth.js setup
 */

/**
 * Generate a random string for state parameter
 */
const generateRandomString = (length = 32) => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let text = "";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

/**
 * Get the base path from current location
 */
const getBasePath = () => {
  // Check if running on NEU domain
  if (window.location.hostname === "fit.neu.edu.vn") {
    return "/scoreup";
  }
  // For development or other domains
  return "";
};

/**
 * Get the full redirect URI including base path
 */
const getRedirectUri = () => {
  const basePath = getBasePath();
  const baseUrl = `${window.location.protocol}//${window.location.host}${basePath}`;

  // Use configured redirect URI or default to /auth/microsoft/callback
  return config.MICROSOFT_REDIRECT_URI || `${baseUrl}/auth/microsoft/callback`;
};

/**
 * Initiate Microsoft OAuth login flow - Alternative approach
 * This uses traditional Web app flow that works with existing Azure configurations
 */
const initiateLogin = async () => {
  if (!config.MICROSOFT_CLIENT_ID) {
    toast.error("Microsoft Client ID chưa được cấu hình!");
    return false;
  }

  if (!config.MICROSOFT_TENANT_ID) {
    toast.error("Microsoft Tenant ID chưa được cấu hình!");
    return false;
  }

  try {
    // Generate state parameter for CSRF protection
    const state = generateRandomString(32);

    // Store state in sessionStorage for later verification
    sessionStorage.setItem("microsoft_oauth_state", state);

    const redirectUri = getRedirectUri();
    const tenantId = config.MICROSOFT_TENANT_ID;

    // Build authorization URL for Web app flow (no PKCE required)
    const authUrl = new URL(
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`
    );
    authUrl.searchParams.set("client_id", config.MICROSOFT_CLIENT_ID);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_mode", "query");
    authUrl.searchParams.set("scope", "openid profile email User.Read");
    authUrl.searchParams.set("state", state);

    // Add prompt parameter to ensure fresh login
    authUrl.searchParams.set("prompt", "select_account");

    console.log("Redirecting to Microsoft with URL:", authUrl.toString());
    console.log("Expected callback URL:", redirectUri);

    // Redirect to Microsoft authorization page
    window.location.href = authUrl.toString();
    return true;
  } catch (error) {
    console.error("Error initiating Microsoft login:", error);
    toast.error("Có lỗi xảy ra khi khởi tạo đăng nhập Microsoft!");
    return false;
  }
};

/**
 * Handle the callback from Microsoft OAuth - Alternative approach
 * Sends authorization code to backend for server-side token exchange
 */
const handleCallback = async (urlParams) => {
  try {
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    const error = urlParams.get("error");
    const errorDescription = urlParams.get("error_description");

    // Check for errors
    if (error) {
      console.error("Microsoft OAuth error:", error, errorDescription);
      toast.error(errorDescription || "Đăng nhập Microsoft thất bại!");
      return false;
    }

    // Verify state parameter to prevent CSRF attacks
    const storedState = sessionStorage.getItem("microsoft_oauth_state");
    if (!state || state !== storedState) {
      toast.error("Trạng thái xác thực không hợp lệ!");
      return false;
    }

    if (!code) {
      toast.error("Không nhận được mã xác thực từ Microsoft!");
      return false;
    }

    console.log("Received authorization code:", code.substring(0, 20) + "...");

    // Send authorization code to backend for server-side token exchange
    // This approach bypasses CORS issues by letting backend handle Microsoft API calls
    const loginResult = await loginWithMicrosoftCode(code);

    // Clean up session storage
    sessionStorage.removeItem("microsoft_oauth_state");

    return loginResult;
  } catch (error) {
    console.error("Error handling Microsoft callback:", error);
    toast.error("Có lỗi xảy ra khi xử lý callback từ Microsoft!");

    // Clean up session storage
    sessionStorage.removeItem("microsoft_oauth_state");

    return false;
  }
};

/**
 * Send Microsoft authorization code to backend for token exchange and authentication
 * Backend will handle the token exchange with Microsoft to avoid CORS issues
 */
const loginWithMicrosoftCode = async (code) => {
  try {
    const redirectUri = getRedirectUri();

    console.log("Sending to backend:", {
      code: code.substring(0, 20) + "...",
      clientId: config.MICROSOFT_CLIENT_ID,
      tenantId: config.MICROSOFT_TENANT_ID,
      redirectUri,
    });

    // Send all necessary data to backend for token exchange
    const loginData = {
      code,
      redirectUri,
    };

    return await authService.loginWithMicrosoft(loginData);
  } catch (error) {
    console.error("Error logging in with Microsoft code:", error);
    toast.error("Có lỗi xảy ra khi đăng nhập với Microsoft!");
    return false;
  }
};

/**
 * Check if current URL is Microsoft OAuth callback
 */
const isCallbackUrl = () => {
  const currentPath = window.location.pathname;
  const basePath = getBasePath();
  const callbackPath = `${basePath}/auth/microsoft/callback`;

  return (
    currentPath === callbackPath || currentPath === "/auth/microsoft/callback"
  );
};

/**
 * Get configuration info for debugging
 */
const getDebugInfo = () => {
  return {
    clientId: config.MICROSOFT_CLIENT_ID ? "✓ Configured" : "✗ Missing",
    tenantId: config.MICROSOFT_TENANT_ID ? "✓ Configured" : "✗ Missing",
    redirectUri: getRedirectUri(),
    currentOrigin: window.location.origin,
    basePath: getBasePath(),
    isCallback: isCallbackUrl(),
  };
};

export default {
  initiateLogin,
  handleCallback,
  isCallbackUrl,
  getRedirectUri,
  getDebugInfo,
};

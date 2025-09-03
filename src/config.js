export default {
  API_URL:
    import.meta.env.VITE_API_URL ||
    "https://scoreup.whoisduyviet.id.vn/api/v1/api",
  MEDIA_URL:
    import.meta.env.VITE_MEDIA_URL ||
    "https://scoreup.whoisduyviet.id.vn/media",
  DATABASE_CERTIFICATES:
    import.meta.env.VITE_NOTION_DATABASE_CERTIFICATES ||
    "4949e95213e94820934b6c8b3400df97",
  CURRENT_CHAPTER: import.meta.env.VITE_CURRENT_CHAPTER || "chuong-1",

  // Microsoft OAuth Configuration
  MICROSOFT_CLIENT_ID: import.meta.env.VITE_MICROSOFT_CLIENT_ID,
  MICROSOFT_TENANT_ID: import.meta.env.VITE_MICROSOFT_TENANT_ID,
  MICROSOFT_REDIRECT_URI: import.meta.env.VITE_MICROSOFT_REDIRECT_URI,
  MICROSOFT_APP_SECRET: import.meta.env.VITE_MICROSOFT_APP_SECRET,
};

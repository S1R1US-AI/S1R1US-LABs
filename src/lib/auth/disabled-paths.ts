/** Better Auth endpoints this app does not use. Disabled server-side (404). */
export const DISABLED_AUTH_PATHS: readonly string[] = [
  "/update-user",
  "/change-email",
  "/delete-user",
  "/delete-user/callback",
];

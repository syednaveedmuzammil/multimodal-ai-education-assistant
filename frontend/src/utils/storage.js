const ACCESS_TOKEN_KEY = "learnmate_access_token";

/**
 * Store the JWT access token.
 */
export function setAccessToken(token) {
  if (!token) {
    return;
  }

  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

/**
 * Retrieve the JWT access token.
 */
export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * Remove the JWT access token.
 */
export function removeAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

/**
 * Check whether an access token exists.
 */
export function hasAccessToken() {
  return Boolean(getAccessToken());
}
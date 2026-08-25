import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "@/services/authService";

import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from "@/utils/storage";


const AuthContext = createContext(null);


/*
 * ============================================================
 * Auth Provider
 * ============================================================
 */

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  /*
   * ==========================================================
   * Restore Authentication State
   * ==========================================================
   *
   * If a JWT exists in localStorage, ask the backend whether
   * the token is still valid.
   *
   * This replaces the previous mock localStorage authentication.
   */

  useEffect(() => {
    const restoreAuthentication = async () => {
      const token = getAccessToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();

        setUser(currentUser);
      } catch {
        /*
         * Token is invalid, expired, or no longer accepted
         * by the backend.
         */

        removeAccessToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreAuthentication();
  }, []);


  /*
   * ==========================================================
   * Login
   * ==========================================================
   */

  const login = async (email, password) => {
    if (!email || !password) {
      throw new Error(
        "Email and password are required."
      );
    }

    const response = await loginUser({
      email,
      password,
    });

    /*
     * Store the JWT returned by FastAPI.
     */

    setAccessToken(response.access_token);

    /*
     * Store the authenticated user in React state.
     */

    setUser(response.user);

    return response.user;
  };


  /*
   * ==========================================================
   * Register
   * ==========================================================
   */

  const register = async (
    name,
    email,
    password
  ) => {
    if (!name || !email || !password) {
      throw new Error(
        "Name, email and password are required."
      );
    }

    const response = await registerUser({
      name,
      email,
      password,
    });

    /*
     * Registration also returns a JWT, so the newly
     * registered user is immediately authenticated.
     */

    setAccessToken(response.access_token);

    setUser(response.user);

    return response.user;
  };


  /*
   * ==========================================================
   * Logout
   * ==========================================================
   */

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      /*
       * The current backend does not maintain a token
       * revocation list. Removing the local JWT is therefore
       * sufficient for the current logout implementation.
       */

      removeAccessToken();
      setUser(null);
    }
  };


  /*
   * ==========================================================
   * Authentication State
   * ==========================================================
   */

  const isAuthenticated = Boolean(user);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  };


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


/*
 * ============================================================
 * useAuth
 * ============================================================
 */

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider."
    );
  }

  return context;
}


export default AuthContext;
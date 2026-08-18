import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

// import {
//   getCurrentUser,
//   loginUser,
//   logoutUser,
//   registerUser,
// } from "@/services/authService";

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = "learnmate_auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
   * ==========================================================
   * Restore authentication state
   * ==========================================================
   *
   * Currently restores the mock authentication state from
   * localStorage.
   *
   * TODO (Backend Integration):
   * Replace this with JWT/token validation when FastAPI
   * authentication is connected.
   */

  useEffect(() => {
    try {
      const storedAuth =
        localStorage.getItem(AUTH_STORAGE_KEY);

      if (storedAuth) {
        const parsedAuth = JSON.parse(storedAuth);

        if (parsedAuth?.user) {
          setUser(parsedAuth.user);
        }
      }
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
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

    /*
     * MOCK AUTHENTICATION
     *
     * TODO (Backend Integration):
     *
     * const response = await authService.login({
     *   email,
     *   password,
     * });
     *
     * setUser(response.user);
     */

    const mockUser = {
      id: "mock-user-001",
      name: email.split("@")[0],
      email,
    };

    setUser(mockUser);

    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        user: mockUser,
      })
    );

    return mockUser;
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

    /*
     * MOCK REGISTRATION
     *
     * TODO (Backend Integration):
     *
     * const response = await authService.register({
     *   name,
     *   email,
     *   password,
     * });
     */

    const mockUser = {
      id: "mock-user-001",
      name,
      email,
    };

    setUser(mockUser);

    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        user: mockUser,
      })
    );

    return mockUser;
  };

  /*
   * ==========================================================
   * Logout
   * ==========================================================
   */

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  /*
   * ==========================================================
   * Auth State
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
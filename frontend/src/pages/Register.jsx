import { useState } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
} from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import APP_CONFIG from "@/config/appConfig";


export default function Register() {
  const {
    register,
    isAuthenticated,
    loading,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);


  /*
   * ==========================================================
   * Redirect authenticated users
   * ==========================================================
   */

  if (!loading && isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }


  /*
   * ==========================================================
   * Input Handler
   * ==========================================================
   */

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  /*
   * ==========================================================
   * Register Submit
   * ==========================================================
   */

  const handleSubmit = async (event) => {
    event.preventDefault();

    const {
      name,
      email,
      password,
      confirmPassword,
    } = formData;


    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      toast.error(
        "Please fill in all fields."
      );

      return;
    }


    /*
     * Backend requires a minimum of 8 characters.
     */

    if (password.length < 8) {
      toast.error(
        "Password must contain at least 8 characters."
      );

      return;
    }


    if (password !== confirmPassword) {
      toast.error(
        "Passwords do not match."
      );

      return;
    }


    try {
      setIsSubmitting(true);

      await register(
        name,
        email,
        password
      );

      toast.success(
        "Account created successfully!"
      );


      /*
       * If registration was triggered after a
       * protected-page redirect, return there.
       *
       * Otherwise, go to Dashboard.
       */

      const redirectPath =
        location.state?.from ||
        "/dashboard";

      navigate(
        redirectPath,
        {
          replace: true,
        }
      );

    } catch (error) {
      toast.error(
        error?.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  /*
   * ==========================================================
   * Loading State
   * ==========================================================
   */

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted">
        Loading...
      </div>
    );
  }


  /*
   * ==========================================================
   * Register UI
   * ==========================================================
   */

  return (
    <div className="min-h-screen bg-background text-white flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-md">

        {/* ================= Logo / Branding ================= */}

        <div className="text-center mb-8">

          <img
            src={APP_CONFIG.logo}
            alt={APP_CONFIG.appName}
            className="w-16 h-16 mx-auto mb-4"
            draggable={false}
          />

          <h1 className="text-3xl font-bold">
            Create Your Account
          </h1>

          <p className="text-muted mt-2">
            Start your personalized AI-powered learning journey.
          </p>

        </div>


        {/* ================= Register Card ================= */}

        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* ================= Name ================= */}

            <div>

              <label
                htmlFor="name"
                className="block text-sm font-medium mb-2"
              >
                Full Name
              </label>

              <div className="relative">

                <User
                  size={18}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-muted
                    pointer-events-none
                  "
                />

                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  className="pl-11"
                />

              </div>

            </div>


            {/* ================= Email ================= */}

            <div>

              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
              >
                Email Address
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-muted
                    pointer-events-none
                  "
                />

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className="pl-11"
                />

              </div>

            </div>


            {/* ================= Password ================= */}

            <div>

              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Password
              </label>

              <div className="relative">

                <LockKeyhole
                  size={18}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-muted
                    pointer-events-none
                  "
                />

                <Input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className="pl-11 pr-12"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    p-2
                    rounded-lg
                    text-muted
                    hover:text-white
                    transition
                  "
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>


            {/* ================= Confirm Password ================= */}

            <div>

              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2"
              >
                Confirm Password
              </label>

              <div className="relative">

                <LockKeyhole
                  size={18}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-muted
                    pointer-events-none
                  "
                />

                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className="pl-11 pr-12"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) => !previous
                    )
                  }
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    p-2
                    rounded-lg
                    text-muted
                    hover:text-white
                    transition
                  "
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>


            {/* ================= Register Button ================= */}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Creating account..."
                : "Create Account"}
            </Button>

          </form>


          {/* ================= Login ================= */}

          <div className="text-center mt-6 pt-6 border-t border-border">

            <p className="text-sm text-muted">

              Already have an account?{" "}

              <Link
                to="/login"
                className="
                  text-primary
                  font-medium
                  hover:text-violet-400
                  transition
                "
              >
                Sign in
              </Link>

            </p>

          </div>

        </div>


        {/* ================= Footer ================= */}

        <p className="text-center text-xs text-muted mt-6">
          {APP_CONFIG.appName} · {APP_CONFIG.tagline}
        </p>

      </div>

    </div>
  );
}
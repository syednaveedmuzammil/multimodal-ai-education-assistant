import { useState } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import APP_CONFIG from "@/config/appConfig";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);

  /*
   * ==========================================================
   * Logout
   * ==========================================================
   */

  const handleLogout = () => {
    logout();

    setProfileOpen(false);

    toast.success("Logged out successfully.");

    navigate("/login", {
      replace: true,
    });
  };

  /*
   * ==========================================================
   * User Display
   * ==========================================================
   */

  const displayName = user?.name || "Student";

  const displayEmail = user?.email || "Welcome Back";

  return (
    <header
      className="
        sticky
        top-0
        z-30
        h-20
        bg-background/80
        backdrop-blur-md
        border-b
        border-border
        flex
        items-center
        justify-between
        px-4
        sm:px-6
      "
    >
      {/* ================= Left Section ================= */}

      <div className="flex items-center gap-4">

        {/* Mobile Menu */}

        <button
          type="button"
          onClick={onMenuClick}
          className="
            lg:hidden
            h-10
            w-10
            rounded-xl
            border
            border-border
            bg-card
            flex
            items-center
            justify-center
            hover:bg-slate-700
            transition
          "
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        {/* Search */}

        <div
          className="
            hidden
            md:flex
            items-center
            gap-3
            bg-card
            border
            border-border
            rounded-xl
            px-4
            py-2
            w-[350px]
          "
        >
          <Search
            size={18}
            className="text-muted"
          />

          <input
            type="text"
            placeholder="Search anything..."
            className="
              bg-transparent
              flex-1
              outline-none
              text-sm
              placeholder:text-muted
            "
          />
        </div>

      </div>

      {/* ================= Right Section ================= */}

      <div className="flex items-center gap-3 sm:gap-4">

        {/* Notifications */}

        <button
          type="button"
          className="
            relative
            h-10
            w-10
            rounded-xl
            border
            border-border
            bg-card
            flex
            items-center
            justify-center
            hover:bg-slate-700
            transition
          "
          aria-label="Notifications"
        >
          <Bell size={18} />

          <span
            className="
              absolute
              -top-1
              -right-1
              w-2.5
              h-2.5
              rounded-full
              bg-danger
            "
          />
        </button>

        {/* Theme */}

        <ThemeToggle />

        {/* ================= Profile ================= */}

        <div className="relative">

          <button
            type="button"
            onClick={() =>
              setProfileOpen((previous) => !previous)
            }
            className="
              flex
              items-center
              gap-2
              sm:gap-3
              rounded-xl
              p-1.5
              hover:bg-card
              transition
            "
            aria-expanded={profileOpen}
            aria-label="Open profile menu"
          >

            <img
              src={APP_CONFIG.logo}
              alt={displayName}
              className="
                w-10
                h-10
                rounded-full
                object-cover
              "
              draggable={false}
            />

            <div className="hidden sm:block text-left">

              <p className="font-medium max-w-[140px] truncate">
                {displayName}
              </p>

              <p className="text-xs text-muted max-w-[140px] truncate">
                {displayEmail}
              </p>

            </div>

            <ChevronDown
              size={16}
              className={`
                hidden
                sm:block
                text-muted
                transition-transform
                duration-200
                ${profileOpen ? "rotate-180" : ""}
              `}
            />

          </button>

          {/* ================= Profile Dropdown ================= */}

          {profileOpen && (
            <div
              className="
                absolute
                right-0
                top-full
                mt-3
                w-64
                rounded-xl
                border
                border-border
                bg-card
                shadow-xl
                overflow-hidden
              "
            >

              {/* User Info */}

              <div className="p-4 border-b border-border">

                <div className="flex items-center gap-3">

                  <div
                    className="
                      h-10
                      w-10
                      rounded-full
                      bg-primary/20
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <User size={20} />
                  </div>

                  <div className="min-w-0">

                    <p className="font-medium truncate">
                      {displayName}
                    </p>

                    <p className="text-xs text-muted truncate">
                      {displayEmail}
                    </p>

                  </div>

                </div>

              </div>

              {/* Profile Link */}

              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/profile");
                }}
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  text-sm
                  text-left
                  text-slate-300
                  hover:bg-slate-700
                  hover:text-white
                  transition
                "
              >
                <User size={18} />

                <span>
                  Profile
                </span>

              </button>

              {/* Logout */}

              <button
                type="button"
                onClick={handleLogout}
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  text-sm
                  text-left
                  text-red-400
                  hover:bg-red-500/10
                  transition
                "
              >
                <LogOut size={18} />

                <span>
                  Logout
                </span>

              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
}
import {
  Bell,
  Menu,
  Search,
} from "lucide-react";
import APP_CONFIG from "@/config/appConfig";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Navbar({
  onMenuClick,
}) {
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
      px-6"
    >
      {/* Left Section */}

      <div className="flex items-center gap-4">

        {/* Mobile Menu */}

        <button
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
          transition"
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
          w-[350px]"
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
            placeholder:text-muted"
          />
        </div>

      </div>

      {/* Right Section */}

      <div className="flex items-center gap-4">

        <button
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
          transition"
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
            bg-danger"
          />
        </button>

        <ThemeToggle />

        {/* Profile */}

        <div className="flex items-center gap-3">

          <img
            src={APP_CONFIG.logo}
            alt={APP_CONFIG.appName}
            className="w-10 h-10 rounded-full"
            draggable={false}
          />

          <div className="hidden sm:block">

            <p className="font-medium">
              Student
            </p>

            <p className="text-xs text-muted">
              Welcome Back
            </p>

          </div>

        </div>

      </div>
    </header>
  );
}
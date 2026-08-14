import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Bot,
  NotebookPen,
  FileText,
  CircleHelp,
  CalendarDays,
  Network,
  BarChart3,
  User,
  Settings,
  X,
} from "lucide-react";

import APP_CONFIG from "@/config/appConfig";
import { NAV_LINKS } from "@/constants/routes";

const iconMap = Object.freeze({
  LayoutDashboard,
  Bot,
  NotebookPen,
  FileText,
  CircleHelp,
  CalendarDays,
  Network,
  BarChart3,
  User,
  Settings,
});

export default function Sidebar({
  isOpen = true,
  onClose = () => {},
}) {
  return (
    <aside
      className={`
        fixed
        top-0
        left-0
        h-screen
        w-72
        bg-sidebar
        border-r
        border-border
        flex
        flex-col
        z-40
        transition-transform
        duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      `}
    >
      {/* ================= Logo ================= */}

      <div className="px-6 py-7 border-b border-border">
        <div className="flex items-center gap-3">
          <img
            src={APP_CONFIG.logo}
            alt={APP_CONFIG.appName}
            className="w-10 h-10"
            loading="eager"
            draggable={false}
          />

          <div>
            <h1 className="font-bold text-lg">
              {APP_CONFIG.appName}
            </h1>

            <p className="text-xs text-muted">
              {APP_CONFIG.tagline}
            </p>
          </div>
        </div>
      </div>
      {/* ================= Close Button ================= */}
      <button
        type="button"
        onClick={onClose}
        className="
          ml-auto
          lg:hidden
          p-2
          rounded-lg
          text-muted
          hover:bg-card
          hover:text-white
          transition
        "
        aria-label="Close sidebar"
      >
        <X size={20} />
      </button>
      {/* ================= Menu ================= */}

      <nav className="flex-1 mt-5 px-4">
        {NAV_LINKS.map((item) => {
          const Icon = iconMap[item.icon] ?? LayoutDashboard;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-xl
                mb-2
                transition-all
                duration-200

                ${
                  isActive
                    ? "bg-primary text-white shadow-lg"
                    : "text-slate-300 hover:bg-card hover:text-white"
                }
                `
              }
            >
              <Icon size={20} />

              <span className="font-medium">
                {item.title}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* ================= Footer ================= */}

      <div className="p-5 border-t border-border">
        <div className="rounded-xl bg-card p-4">
          <p className="text-sm text-muted">
            Version
          </p>

          <h4 className="font-semibold mt-1">
            {APP_CONFIG.appName} v{APP_CONFIG.version}
          </h4>
        </div>
      </div>
    </aside>
  );
}
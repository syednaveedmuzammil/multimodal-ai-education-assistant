import APP_CONFIG from "@/config/appConfig";

export default function Footer() {
  return (
    <footer
      className="
      border-t
      border-border
      px-6
      py-5
      mt-8
      flex
      flex-col
      md:flex-row
      justify-between
      items-center
      gap-3"
    >
      <p className="text-sm text-muted">
        © {new Date().getFullYear()} {APP_CONFIG.appName}. All rights reserved.
      </p>

      <p className="text-sm text-muted">
        Built with ❤️ using React + FastAPI
      </p>
    </footer>
  );
}
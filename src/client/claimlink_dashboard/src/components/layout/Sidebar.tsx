import navItems from "@/components/layout/SideBarNavItems";
import { Link, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";
import clsx from "clsx";

const Brand = () => {
  return (
    <div className="flex items-center gap-3 h-10 w-full px-4 select-none">
      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal-400 via-cyan-400 to-sky-300" />
      <span className="text-lg font-semibold tracking-wide text-[#E0E6EA]">
        ORIGYN
      </span>
    </div>
  );
};

const NavLink = ({
  title,
  url,
  icon,
  isActive,
  isDisabled = false,
}: {
  title: string;
  url: string;
  icon: ReactNode;
  isActive: boolean;
  isDisabled?: boolean;
}) => {
  return (
    <Link
      type="button"
      to={isDisabled ? "#" : url}
      className={clsx(
        "flex items-center gap-4 rounded-lg w-full px-4 py-3 overflow-hidden",
        "text-[14px] transition-colors",
        {
          "pointer-events-none opacity-50 cursor-not-allowed": isDisabled,
          "bg-[rgba(133,241,255,0.25)] text-white": isActive && !isDisabled,
          "text-[#80848a] hover:bg-white/5": !isActive || isDisabled,
        },
      )}
      aria-disabled={isDisabled}
    >
      <div className="h-[22px] w-[22px] text-current">{icon}</div>
      <div className="leading-4 whitespace-pre">{title}</div>
    </Link>
  );
};

const SideNav = ({ className }: { className?: string }) => {
  const location = useLocation();
  const active = location.pathname;

  return (
    <aside className={clsx("flex flex-col justify-between h-full", className)}>
      <div className="flex flex-col items-start gap-10 px-4 pt-10">
        <Brand />

        <nav className="w-[250px] px-2">
          <ul className="flex flex-col gap-1">
            {navItems.map(({ title, url, icon }, i) => (
              <li key={i}>
                <NavLink
                  title={title}
                  url={url}
                  icon={icon}
                  isActive={active.startsWith(url)}
                />
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="px-6 pb-10">
        <div className="bg-white rounded-2xl w-[202px] p-6">
          <div className="flex flex-col gap-4 text-[14px] text-[#69737c]">
            <button type="button" className="text-left leading-4">
              Technical help
            </button>
            <button type="button" className="text-left leading-4">
              Contact us
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideNav;

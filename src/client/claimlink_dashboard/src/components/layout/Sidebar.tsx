import navItems from "@/components/layout/SideBarNavItems";
import { Link, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";
import clsx from "clsx";

const Brand = () => {
  return (
    <div className="h-10 w-[175px] relative select-none">
      {/* ORIGYN Logo - exact Figma design */}
      <div className="absolute inset-[3.09%_3.39%_3.14%_2.84%]">
        {/* Icon part */}
        <div className="absolute inset-[3.09%_74.91%_3.14%_2.84%]">
          <div className="w-full h-full bg-gradient-to-br from-orange-400 via-blue-500 to-purple-600 rounded-sm" />
        </div>
        {/* ORIGYN text */}
        <div className="absolute inset-[24.7%_3.39%_23.13%_31.66%] flex items-center">
          <span className="font-['General_Sans'] font-medium text-white text-lg tracking-wide">
            ORIGYN
          </span>
        </div>
      </div>
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
        "font-['General_Sans'] font-medium text-[14px] leading-4 transition-colors",
        {
          "pointer-events-none opacity-50 cursor-not-allowed": isDisabled,
          "bg-[rgba(133,241,255,0.25)] text-white": isActive && !isDisabled,
          "text-[#80848a] hover:bg-white/5": !isActive || isDisabled,
        },
      )}
      aria-disabled={isDisabled}
    >
      <div className="h-[22px] w-[22px] shrink-0 text-current">{icon}</div>
      <div className="leading-4 whitespace-pre">{title}</div>
    </Link>
  );
};

const SideNav = ({ className }: { className?: string }) => {
  const location = useLocation();
  const active = location.pathname;

  return (
    <aside className={clsx(
      "flex flex-col items-center justify-between h-full p-[40px]", 
      className
    )}>
      {/* Content */}
      <div className="flex flex-col gap-10 items-center justify-start shrink-0">
        <Brand />

        {/* Navigation Menu */}
        <nav className="w-[250px] px-2 py-0">
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

      {/* Footer */}
      <div className="flex flex-col gap-6 items-start justify-start shrink-0 w-[202px]">
        <div className="flex flex-col gap-2 items-start justify-start">
          <div className="bg-white rounded-2xl w-[202px] p-6">
            <div className="flex flex-col gap-4 font-['General_Sans'] font-medium text-[14px] text-[#69737c] leading-4 w-[98px] overflow-hidden">
              <button type="button" className="text-left w-full">
                Technical help
              </button>
              <button type="button" className="text-left w-full">
                Contact us
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideNav;

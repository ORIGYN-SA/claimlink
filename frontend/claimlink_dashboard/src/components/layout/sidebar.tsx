import navItems from "@/components/layout/sidebar-nav-items";
import { Link, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";
import clsx from "clsx";
import icon from "@/assets/icon.svg";

const Brand = () => {
  return (
    <div className="h-10 w-[175px] relative select-none">
      {/* ORIGYN Logo - exact Figma design */}
      <div className="absolute inset-[3.09%_3.39%_3.14%_2.84%]">
        {/* Icon part */}
        <div className="absolute inset-[3.09%_74.91%_3.14%_2.84%]">
          {/* <div className="w-full h-full bg-gradient-to-br from-orange-400 via-blue-500 to-purple-600 rounded-sm" /> */}
          <img
          src={icon}
          // className="h-[40vmin] pointer-events-none animate-[spin_20s_linear_infinite]"
          alt="logo"
        />
        </div>
        {/* ORIGYN text */}
        <div className="absolute inset-[24.7%_3.39%_23.13%_31.66%] flex items-center">
          <span className="font-sans font-medium text-white text-lg tracking-wide">
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
        "box-border content-stretch flex gap-4 items-center justify-start overflow-clip px-4 py-3 relative rounded-[8px] w-full",
        "font-sans font-medium text-[14px] leading-[0] not-italic transition-colors",
        {
          "pointer-events-none opacity-50 cursor-not-allowed": isDisabled,
          "bg-[rgba(133,241,255,0.25)] text-white": isActive && !isDisabled,
          "text-[#80848a] hover:bg-white/5": !isActive && !isDisabled,
        },
      )}
      aria-disabled={isDisabled}
    >
      <div className="relative shrink-0 size-[22px] text-current">{icon}</div>
      <div className="leading-[16px] whitespace-pre shrink-0">{title}</div>
    </Link>
  );
};

const SideNav = ({ className }: { className?: string }) => {
  const location = useLocation();
  const active = location.pathname;

  return (
    <div className={clsx(
      "box-border content-stretch flex flex-col items-center justify-between p-[40px] relative w-[250px] h-full",
      className
    )} data-name="Sidebar">
      {/* Content */}
      <div className="content-stretch flex flex-col gap-10 items-center justify-start relative shrink-0" data-name="Content">
        <Brand />

        {/* Navigation Menu */}
        <div className="box-border content-stretch flex flex-col gap-1 items-center justify-start px-2 py-0 relative shrink-0 w-[250px]" data-name="Menus">
          <ul className="flex flex-col gap-1 w-full">
            {navItems.map(({ title, url, icon }, i) => (
              <li key={i} className="w-full">
                <NavLink
                  title={title}
                  url={url}
                  icon={icon}
                  isActive={active.startsWith(url)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="content-stretch flex flex-col gap-6 items-start justify-start relative shrink-0 w-[202px]" data-name="Footer">
        <div className="content-stretch flex flex-col gap-2 items-start justify-start relative shrink-0">
          <div className="bg-white box-border content-stretch flex flex-col gap-6 items-start justify-start p-[24px] relative rounded-[16px] shrink-0 w-[202px]" data-name="Footer">
            <div className="content-stretch flex flex-col font-sans gap-4 items-start justify-start leading-[0] not-italic overflow-clip relative shrink-0 text-[#69737c] text-[14px] w-[98px]" data-name="Menu">
              <button type="button" className="relative shrink-0 w-full text-left hover:text-[#80848a] transition-colors">
                <p className="leading-[16px]">Technical help</p>
              </button>
              <button type="button" className="relative shrink-0 w-full text-left hover:text-[#80848a] transition-colors">
                <p className="leading-[16px]">Contact us</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideNav;

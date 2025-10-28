import {
  IBarsRegular,
  IChevronLeft,
  IRightFromBracket,
} from "@/components/Icons";
import CustomImage from "@/components/modules/CustomImage";
import NavLink from "@/components/modules/NavLink";
import NotificationModal from "@/components/modules/NotificationModal";
import { cn, logout } from "@/lib/utils";
import { useUserInfo } from "@/services/queries/client/auth/useUserInfo";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { type MenuItem } from "./PanelMenu";
import NotificationButton from "./notification/NotificationButton";
import NotificationCenter from "./notification/NotificationCenter";

interface PanelMenuDesktopProps {
  menuData: MenuItem[];
  openedMenuTitle: string | null;
  setOpenedMenuTitle: (title: string | null) => void;
  isMinimized: boolean;
  handleMinimizeToggle: () => void;
  setIsMinimized: (min: boolean) => void;
  setIsMobileMenuOpen: (open: boolean) => void;
  profileUrl: string;
}

export default function PanelMenuDesktop({
  menuData,
  openedMenuTitle,
  setOpenedMenuTitle,
  isMinimized,
  handleMinimizeToggle,
  setIsMinimized,
  setIsMobileMenuOpen,
  profileUrl,
}: PanelMenuDesktopProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { userInfo } = useUserInfo();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationTriggerRef = useRef<HTMLButtonElement>(null);
  const notificationTriggerRefMobile = useRef<HTMLButtonElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "sticky top-0 z-40 w-full shrink-0 px-4 pt-4 transition-all duration-300 ease-in-out lg:block lg:h-dvh lg:max-w-xs lg:py-4 lg:pl-0 lg:pr-4 xl:py-5 xl:pr-5",
        isMinimized && "lg:max-w-[96px] xl:max-w-[107px]",
      )}>
      <aside
        className={cn(
          "sticky top-2 z-40 flex h-full w-full shrink-0 items-center justify-between rounded-xl border-primary-border/50 bg-background transition-all duration-300 ease-in-out max-lg:border lg:col-span-3 lg:block lg:max-w-xs lg:rounded-2xl",
          isMinimized && "items-center !px-0 lg:max-w-[80px]",
          isScrolled && "max-lg:shadow-md",
        )}>
        <div
          className={cn(
            "relative flex size-full items-center justify-between max-lg:!px-3 max-lg:!py-2 lg:flex-col lg:items-stretch lg:p-7 lg:!pb-36",
            isMinimized && "!px-0",
          )}>
          <div
            className={cn(
              "flex items-center justify-between gap-4 lg:h-14",
              isMinimized && "justify-center gap-0",
            )}>
            <Link
              href="/"
              className={cn(
                "w-[44px] shrink-0 overflow-hidden transition-all duration-300 lg:w-14",
                isMinimized && "lg:hidden",
              )}>
              <CustomImage
                src="/images/logo.png"
                alt="logo"
                width={200}
                height={200}
                className="size-full object-contain"
              />
            </Link>
            <button
              className="hidden rounded-lg p-2 opacity-90 transition-all hover:bg-primary/5 hover:opacity-100 lg:block"
              onClick={handleMinimizeToggle}>
              <IChevronLeft
                className={cn(
                  "size-5 rotate-180 transition-transform duration-300",
                  isMinimized && "-rotate-0",
                )}
              />
            </button>
          </div>
          {/* Mobile menu trigger button */}
          <div className="relative flex items-center gap-4 pl-2 lg:static lg:hidden">
            <Link
              href={profileUrl}
              className="size-9 overflow-hidden rounded-full">
              <CustomImage
                src={
                  userInfo?.data?.data.avatar?.url ||
                  "/images/profile-placeholder.jpg"
                }
                alt="avatar"
                width={200}
                height={200}
                className="size-full object-cover"
              />
            </Link>
            <NotificationButton
              ref={notificationTriggerRefMobile}
              onClick={() => setIsNotificationOpen(true)}
              className="!h-9 !w-9 !rounded-full !border-none !bg-transparent !p-0 hover:!bg-gray-100"
            />
            <button
              className="p-1 opacity-90"
              onClick={() => setIsMobileMenuOpen(true)}>
              <IBarsRegular className="size-7" />
            </button>
          </div>
          <div className="mt-10 hidden h-full grid-cols-1 grid-rows-1 overflow-y-auto overflow-x-hidden lg:grid">
            <nav
              className={cn(
                "hidden flex-col space-y-3 lg:flex",
                isMinimized && "items-center",
              )}>
              {menuData.map((item) =>
                item.subItems ? (
                  <div className="w-full" key={item.title}>
                    <button
                      title={item.title}
                      className={cn(
                        "flex w-full items-center justify-start gap-x-2.5 py-1 text-lg",
                        isMinimized && "!w-[80px] justify-center gap-0",
                        item.subItems?.some((subItem) =>
                          pathname.startsWith(subItem.href.split("?")[0]),
                        ) && "text-primary",
                      )}
                      onClick={() => {
                        setOpenedMenuTitle(
                          openedMenuTitle === item.title ? null : item.title,
                        );
                        setIsMinimized(false);
                        localStorage.setItem("panelMenuMinimized", "false");
                      }}>
                      {item.icon}
                      <span
                        className={cn(
                          "text-nowrap transition-all duration-300",
                          isMinimized ? "w-0 opacity-0" : "w-auto opacity-100",
                        )}>
                        {item.title}
                      </span>
                    </button>
                    {!isMinimized && (
                      <div
                        className={cn(
                          "mr-2.5 mt-1 flex flex-col space-y-3 overflow-hidden border-r border-primary-border py-2 pr-5 transition-all duration-300",
                          openedMenuTitle === item.title
                            ? "max-h-96"
                            : "!m-0 max-h-0 py-0",
                        )}>
                        {item.subItems.map((subItem) => (
                          <NavLink
                            key={subItem.title}
                            checkSearchParams={true}
                            href={subItem.href}
                            startsWith={subItem.startsWith}
                            title={subItem.title}
                            className={cn(
                              "text-nowrap transition-all duration-300 [&.active]:text-primary",
                              isMinimized
                                ? "w-0 opacity-0"
                                : "w-auto opacity-100",
                            )}>
                            {subItem.title}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full" key={item.title}>
                    <NavLink
                      href={item.href || "#"}
                      title={item.title}
                      startsWith={item.startsWith}
                      className={cn(
                        "flex w-full items-center justify-start gap-x-2.5 py-1 text-lg [&.active]:text-primary",
                        isMinimized && "!w-[80px] justify-center gap-0",
                      )}>
                      {item.icon}
                      <span
                        className={cn(
                          "text-nowrap transition-all duration-300",
                          isMinimized ? "w-0 opacity-0" : "w-auto opacity-100",
                        )}>
                        {item.title}
                      </span>
                    </NavLink>
                  </div>
                ),
              )}
            </nav>
          </div>
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 hidden h-fit w-full flex-col gap-2 overflow-hidden p-3 !pt-2 transition-all lg:flex",
              isMinimized && "!gap-0 !p-0",
            )}>
            <div className="group relative">
              <NotificationButton
                ref={notificationTriggerRef}
                onClick={() => {
                  setIsNotificationOpen(!isNotificationOpen);
                }}
                isMinimized={isMinimized}
                isOpen={isNotificationOpen}
              />
            </div>
            <div
              className={cn(
                "hidden h-fit w-full items-center justify-center overflow-hidden !pt-0 transition-all lg:flex",
              )}>
              <div
                className={cn(
                  "flex h-fit w-full cursor-pointer items-center justify-between gap-2 rounded-lg bg-neutral-100 p-2.5 transition-all hover:bg-neutral-200",
                  isMinimized &&
                    "justify-center bg-transparent p-0 pb-4 hover:bg-transparent",
                )}
                onClick={() => {
                  router.push(profileUrl);
                  setIsMobileMenuOpen(false);
                }}>
                <div className="flex items-center gap-2">
                  <div className="size-12 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm">
                    <CustomImage
                      src={
                        userInfo?.data?.data.avatar?.url ||
                        "/images/profile-placeholder.jpg"
                      }
                      alt="avatar"
                      width={200}
                      height={200}
                      className="size-full object-cover"
                    />
                  </div>
                  <div className={cn("space-y-0.5", isMinimized && "hidden")}>
                    <p className="line-clamp-1 text-nowrap font-semibold">
                      {userInfo?.data?.data.firstName}{" "}
                      {userInfo?.data?.data.lastName}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {userInfo?.data?.data.phoneNumber}
                    </p>
                  </div>
                </div>
                <div
                  className={cn("shrink-0", isMinimized && "hidden")}
                  onClick={async (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}>
                  <NotificationModal
                    title="خروج"
                    description="آیا از خروج از حساب مطمئن هستید؟"
                    className={cn(
                      "rounded-full p-2 text-neutral-500 transition-all hover:bg-red/10 hover:text-red",
                      isMinimized && "hidden",
                    )}
                    aria-label="خروج"
                    actionName="خروج"
                    onSubmit={async () => {
                      await logout();

                      return true;
                    }}>
                    <IRightFromBracket className="size-5" />
                  </NotificationModal>
                </div>
              </div>
            </div>
          </div>
          <NotificationCenter
            triggerRef={notificationTriggerRef}
            triggerRefMobile={notificationTriggerRefMobile}
            isOpen={isNotificationOpen}
            onClose={() => {
              setIsNotificationOpen(false);
            }}
          />
        </div>
      </aside>
    </div>
  );
}

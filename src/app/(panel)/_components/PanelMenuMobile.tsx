import { IRightFromBracket } from "@/components/Icons";
import NavLink from "@/components/modules/NavLink";
import NotificationModal from "@/components/modules/NotificationModal";
import { cn, logout } from "@/lib/utils";
import { useUserInfo } from "@/services/queries/client/auth/useUserInfo";
import { XIcon } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { type MenuItem } from "./PanelMenu";

interface PanelMenuMobileProps {
  menuData: MenuItem[];
  openedMenuTitle: string | null;
  setOpenedMenuTitle: (title: string | null) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  profileUrl: string;
}

export default function PanelMenuMobile({
  menuData,
  openedMenuTitle,
  setOpenedMenuTitle,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  profileUrl,
}: PanelMenuMobileProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { userInfo } = useUserInfo();

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex lg:hidden",
        isMobileMenuOpen ? "visible" : "invisible",
      )}>
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/50 transition-opacity duration-300",
          isMobileMenuOpen ? "opacity-100" : "opacity-0",
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Menu Panel */}
      <div
        className={cn(
          "absolute right-0 top-0 h-full w-[320px] bg-background p-6 transition-all duration-300",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full",
        )}>
        <div className="flex items-center justify-between">
          <div className="size-12">
            <Image
              src="/images/logo.png"
              alt="logo"
              width={200}
              height={200}
              className="size-full object-contain"
            />
          </div>
          <button
            className="p-1 opacity-90"
            onClick={() => setIsMobileMenuOpen(false)}>
            <XIcon className="size-7" />
          </button>
        </div>

        <nav className="mt-8 space-y-3">
          {menuData.map((item) =>
            item.subItems ? (
              <div className="w-full" key={item.title}>
                <button
                  className={cn(
                    "flex w-full items-center justify-start gap-x-2.5 py-1 text-lg",
                    item.subItems?.some((subItem) =>
                      pathname.startsWith(subItem.href),
                    ) && "text-primary",
                  )}
                  onClick={() => {
                    setOpenedMenuTitle(
                      openedMenuTitle === item.title ? null : item.title,
                    );
                    // setIsMobileMenuOpen(false);
                  }}>
                  {item.icon}
                  <span>{item.title}</span>
                </button>
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
                      href={subItem.href}
                      startsWith={subItem.startsWith}
                      className="text-nowrap [&.active]:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}>
                      {subItem.title}
                    </NavLink>
                  ))}
                </div>
              </div>
            ) : (
              <NavLink
                key={item.title}
                href={item.href || "#"}
                startsWith={item.startsWith}
                className="flex w-full items-center justify-start gap-x-2.5 py-1 text-lg [&.active]:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}>
                {item.icon}
                <span>{item.title}</span>
              </NavLink>
            ),
          )}
        </nav>
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 flex h-fit w-full items-center justify-center overflow-hidden p-3 !pt-0 transition-all",
          )}>
          <div
            className={cn(
              "flex h-fit w-full cursor-pointer items-center justify-between gap-2 rounded-lg bg-neutral-100 p-2.5 transition-all hover:bg-neutral-200",
            )}
            onClick={() => {
              router.push(profileUrl);
              setIsMobileMenuOpen(false);
            }}>
            <div className="flex items-center gap-2">
              <div className="size-12 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm">
                <Image
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
              <div className={cn("space-y-0.5")}>
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
              className="shrink-0"
              onClick={async (event) => {
                event.preventDefault();
                event.stopPropagation();
              }}>
              <NotificationModal
                title="خروج"
                description="آیا از خروج از حساب مطمئن هستید؟"
                className={cn(
                  "rounded-full p-2 text-neutral-500 transition-all hover:bg-red/10 hover:text-red",
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
    </div>
  );
}

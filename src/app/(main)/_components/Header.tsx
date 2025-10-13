"use client";
import { useState } from "react";
import Logo from "@/components/modules/Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Profile from "./Profile";
import AuthButtons from "./AuthButtons";
import { useUserInfo } from "@/services/queries/client/auth/useUserInfo";
import { Loader2 } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { userInfo } = useUserInfo();

  return (
    <header className="w-full border-b border-[#EEEE] bg-white">
      <div className="mx-auto flex items-center justify-between px-5 py-4 lg:px-14">
        <div className="flex items-center gap-8">
          <Logo />
          {/* Desktop Navigation */}
          <nav aria-label="Main Navigation" className="hidden md:block">
            <ul className="m-0 flex list-none gap-6 p-0">
              <li>
                <Link
                  href="/about-us"
                  title="درباره ما"
                  aria-label="درباره ما"
                  className="font-medium text-gray-700 transition-colors hover:text-primary">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  title="تماس با ما"
                  aria-label="تماس با ما"
                  className="font-medium text-gray-700 transition-colors hover:text-primary">
                  تماس با ما
                </Link>
              </li>
              <li>
                <Link
                  href="/collaboration"
                  title="همکاری با ما"
                  aria-label="همکاری با ما"
                  className="font-medium text-gray-700 transition-colors hover:text-primary">
                  همکاری با ما
                </Link>
              </li>
              <li>
                <Link
                  href="/commission"
                  title="محاسبه آنلاین کمیسیون"
                  aria-label="محاسبه آنلاین کمیسیون"
                  className="font-medium text-gray-700 transition-colors hover:text-primary">
                  محاسبه آنلاین کمیسیون
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            className="flex size-10 items-center justify-center rounded-lg border border-[#EEE] bg-white/80 shadow backdrop-blur-lg transition-all duration-300 md:hidden"
            aria-label={menuOpen ? "بستن منو" : "باز کردن منو"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            type="button">
            <span className="sr-only">Toggle menu</span>
            <svg
              className={`h-6 w-6 transition-transform duration-300 ${menuOpen ? "rotate-90" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8h16M4 16h16"
                />
              )}
            </svg>
          </button>

          {/* Desktop Auth/Profile */}
          <div className="hidden md:block">
            {userInfo.isLoading ? (
              <div className="flex h-12 w-44 animate-pulse justify-center rounded-full bg-neutral-200" />
            ) : userInfo?.data?.data?.firstName ? (
              <Profile
                user={{
                  avatar: {
                    url: userInfo?.data?.data?.avatar?.url || "",
                  },
                  firstName: userInfo?.data?.data?.firstName || "",
                  lastName: userInfo?.data?.data?.lastName || "",
                }}
              />
            ) : (
              <AuthButtons />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation */}
      <nav
        id="mobile-menu"
        aria-label="Mobile Main Navigation"
        className={`fixed left-0 right-0 top-[72px] z-40 mx-2 rounded-2xl border border-[#EEEE] bg-white/80 shadow-2xl backdrop-blur-lg transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${menuOpen ? "max-h-[500px] translate-y-0 py-6 opacity-100" : "max-h-0 -translate-y-4 overflow-hidden py-0 opacity-0"}`}>
        <ul className="flex flex-col gap-4 px-6">
          <li>
            <Link
              href="/about-us"
              title="درباره ما"
              aria-label="درباره ما"
              className={`block rounded-lg px-2 py-2 font-medium text-gray-700 transition-all hover:text-primary ${pathname === "/about-us" ? "bg-primary/10 text-primary" : ""}`}
              onClick={() => setMenuOpen(false)}>
              درباره ما
            </Link>
          </li>
          <li>
            <Link
              href="/contact-us"
              title="تماس با ما"
              aria-label="تماس با ما"
              className={`block rounded-lg px-2 py-2 font-medium text-gray-700 transition-all hover:text-primary ${pathname === "/contact-us" ? "bg-primary/10 text-primary" : ""}`}
              onClick={() => setMenuOpen(false)}>
              تماس با ما
            </Link>
          </li>
          <li>
            <Link
              href="/collaboration"
              title="همکاری با ما"
              aria-label="همکاری با ما"
              className={`block rounded-lg px-2 py-2 font-medium text-gray-700 transition-all hover:text-primary ${pathname === "/collaboration" ? "bg-primary/10 text-primary" : ""}`}
              onClick={() => setMenuOpen(false)}>
              همکاری با ما
            </Link>
          </li>
          <li>
            <Link
              href="/commission"
              title="محاسبه آنلاین کمیسیون"
              aria-label="محاسبه آنلاین کمیسیون"
              className={`block rounded-lg px-2 py-2 font-medium text-gray-700 transition-all hover:text-primary ${pathname === "/commission" ? "bg-primary/10 text-primary" : ""}`}
              onClick={() => setMenuOpen(false)}>
              محاسبه آنلاین کمیسیون
            </Link>
          </li>
        </ul>

        {/* Mobile Auth/Profile */}
        <div className="mt-8 px-6">
          {userInfo.isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="size-5 animate-spin" />
            </div>
          ) : userInfo?.data?.data?.firstName ? (
            <div className="via-whit flex items-center gap-3 rounded-xl bg-gradient-to-tr from-primary/10 to-primary/5 p-4 shadow">
              <Profile
                user={{
                  avatar: {
                    url: userInfo?.data?.data?.avatar?.url || "",
                  },
                  firstName: userInfo?.data?.data?.firstName || "",
                  lastName: userInfo?.data?.data?.lastName || "",
                }}
              />
            </div>
          ) : (
            <div className="flex justify-center">
              <AuthButtons />
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

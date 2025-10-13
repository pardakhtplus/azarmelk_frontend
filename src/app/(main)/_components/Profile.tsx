"use client";
import Modal from "@/components/modules/Modal";
import { logout } from "@/lib/utils";
import { Permissions } from "@/permissions/permission.types";
import { useUserInfo } from "@/services/queries/client/auth/useUserInfo";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function Profile({
  user,
}: {
  user: {
    avatar: {
      url: string;
    };
    firstName: string;
    lastName: string;
  };
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { userInfo } = useUserInfo();

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleProfileClick = () => {
    if (isMobile) {
      setIsMobileModalOpen(true);
    } else {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const menuItems = [
    {
      isVisible: !userInfo.data?.data?.accessPerms.includes(Permissions.USER),
      label: "داشبورد",
      href: "/dashboard",
      onClick: () => {
        setIsDropdownOpen(false);
        setIsMobileModalOpen(false);
      },
    },
    {
      isVisible: true,
      label: "پنل کاربری",
      href: "/user-panel",
      onClick: () => {
        setIsDropdownOpen(false);
        setIsMobileModalOpen(false);
      },
    },
    {
      isVisible: true,
      label: "خروج",
      href: "#",
      onClick: () => {
        setIsDropdownOpen(false);
        setIsMobileModalOpen(false);
        handleLogout();
      },
      isLogout: true,
    },
  ];

  if (!user.firstName) return null;

  return (
    <>
      {/* Profile trigger */}
      <div
        className="relative flex h-fit w-full items-center"
        ref={dropdownRef}>
        <button
          onClick={handleProfileClick}
          className="w-full transition-opacity focus:outline-none"
          aria-label="منوی پروفایل">
          <div className="flex flex-row items-center gap-2.5">
            <div className="size-12 overflow-hidden rounded-full bg-[#D9D9D9]">
              <Image
                src={user.avatar?.url || "/images/profile-placeholder.jpg"}
                alt={user.firstName + " " + user.lastName}
                width={53}
                height={53}
                className="size-12 object-cover"
              />
            </div>
            <span className="font-medium text-gray-800">
              {user.firstName + " " + user.lastName}
            </span>
          </div>
        </button>

        {/* Desktop Dropdown */}
        {!isMobile && isDropdownOpen && (
          <div className="absolute left-0 top-full z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
            {menuItems.map((item, index) => (
              <div key={index}>
                {item.isLogout ? (
                  <button
                    onClick={item.onClick}
                    className="flex w-full items-center px-4 py-2 text-right text-sm text-red-600 transition-colors hover:bg-red-50">
                    {item.label}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    onClick={item.onClick}
                    className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50">
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Modal */}
      {typeof window !== "undefined" &&
        createPortal(
          <Modal
            isOpen={isMobileModalOpen}
            title="منوی پروفایل"
            classNames={{
              background: "z-[60] !py-0 !px-4",
              box: "!max-w-sm !max-h-[95%] rounded-xl overflow-x-hidden !h-fit",
              header: "!py-4",
            }}
            onCloseModal={() => setIsMobileModalOpen(false)}
            onClickOutside={() => setIsMobileModalOpen(false)}>
            <div className="px-6 py-6">
              {/* Profile info in modal */}
              <div className="mb-6 flex flex-col items-center text-center">
                <div className="mb-3 size-16 overflow-hidden rounded-full bg-[#D9D9D9]">
                  <Image
                    src={user.avatar?.url || "/images/profile-placeholder.jpg"}
                    alt={user.firstName + " " + user.lastName}
                    width={64}
                    height={64}
                    className="size-16 object-cover"
                  />
                </div>
                <span className="font-medium text-gray-800">
                  {user.firstName + " " + user.lastName}
                </span>
              </div>

              {/* Menu items */}
              <div className="space-y-2">
                {menuItems.map((item, index) => (
                  <div key={index}>
                    {item.isLogout ? (
                      <button
                        onClick={item.onClick}
                        className="flex w-full items-center justify-center rounded-lg bg-red-50 px-4 py-3 text-red-600 transition-colors hover:bg-red-100">
                        {item.label}
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={item.onClick}
                        className="flex w-full items-center justify-center rounded-lg bg-gray-50 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-100">
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Modal>,
          document.body,
        )}
    </>
  );
}

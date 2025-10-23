"use client";

import PanelBodyHeader from "@/app/(panel)/_components/PanelBodyHeader";
import { getCookie, removeCookie, setCookie } from "@/lib/server-utils";
import { API_CONFIG, buildUrlWithQuery } from "@/services/api-config";
import axios from "axios";
import { TriangleAlertIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ForbiddenContainer() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [refreshFailed, setRefreshFailed] = useState(false);

  useEffect(() => {
    const attemptTokenRefresh = async () => {
      try {
        setIsRefreshing(true);

        // Get refresh token from cookie
        const refreshToken = await getCookie("refreshToken");

        if (!refreshToken) {
          // No refresh token available, user needs to login
          setRefreshFailed(true);
          setIsRefreshing(false);
          return;
        }

        // Attempt to refresh the access token
        const response = await axios.post(
          buildUrlWithQuery(API_CONFIG.endpoints.client.IAM.refreshToken),
          {
            refresh_token: refreshToken,
          },
        );

        if (response.status < 300 && response.data?.accessToken) {
          // Successfully refreshed token
          await setCookie("accessToken", response.data.accessToken);
          await setCookie("refreshToken", response.data.refreshToken);

          // Redirect back to the previous page or dashboard
          // We can't get the exact previous page that caused the 403, so redirect to dashboard
          // window.location.reload();
          return;
        } else {
          throw new Error("Token refresh failed");
        }
      } catch (error) {
        console.error("Token refresh failed:", error);

        // Clear invalid tokens
        await removeCookie("refreshToken");
        await removeCookie("accessToken");

        setRefreshFailed(true);
      } finally {
        setIsRefreshing(false);
      }
    };

    // Only attempt refresh on initial load
    attemptTokenRefresh();
  }, [router]);

  // Show loading state while refreshing
  if (isRefreshing) {
    return (
      <>
        <PanelBodyHeader
          title="در حال بررسی دسترسی"
          breadcrumb={
            <>
              <Link href="/dashboard">داشبورد</Link>
              <span className="mx-2">/</span>
              <span>بررسی دسترسی</span>
            </>
          }
        />

        <div className="mt-8 flex flex-col items-center justify-center space-y-6 py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              در حال بررسی دسترسی
            </h2>
            <p className="max-w-md text-gray-600">
              لطفاً صبر کنید، در حال بررسی دسترسی‌های شما هستیم...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PanelBodyHeader
        title="دسترسی محدود"
        breadcrumb={
          <>
            <Link href="/dashboard">داشبورد</Link>
            <span className="mx-2">/</span>
            <span>خطای 403</span>
          </>
        }
      />

      <div className="mt-8 flex flex-col items-center justify-center space-y-6 py-12">
        <div className="rounded-full bg-red-100 p-7">
          <TriangleAlertIcon className="size-14 text-red" />
        </div>

        <div className="space-y-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900">دسترسی غیرمجاز</h2>
          <p className="max-w-md text-gray-600">
            {refreshFailed
              ? "شما دسترسی لازم برای مشاهده این صفحه را ندارید. لطفاً مجدداً وارد شوید یا با مدیر سیستم تماس بگیرید."
              : "شما دسترسی لازم برای مشاهده این صفحه را ندارید. لطفاً با مدیر سیستم تماس بگیرید یا به صفحه اصلی بازگردید."}
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
            بررسی مجدد
          </button>
          {refreshFailed ? (
            <></>
          ) : (
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              بازگشت به داشبورد
            </Link>
          )}
          <Link
            href="/"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
            صفحه اصلی
          </Link>
        </div>
      </div>
    </>
  );
}

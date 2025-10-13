"use client";

import { ESTATE_STATUS } from "@/enums";
import { type TEstate } from "@/types/types";
import { Building, MapPin } from "lucide-react";
import Link from "next/link";

interface EstateInfoSectionProps {
  estate: TEstate;
}

export default function EstateInfoSection({ estate }: EstateInfoSectionProps) {
  return (
    <div className="rounded-xl bg-neutral-50 p-3 !pt-4 sm:p-6 sm:!pt-5">
      <h3 className="mb-4 flex items-center gap-3 text-lg font-semibold text-gray-900">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
          <Building className="h-5 w-5 text-blue-600" />
        </div>
        اطلاعات ملک
      </h3>

      <div className="space-y-2 sm:space-y-4">
        <div className="rounded-lg border border-primary-border/30 bg-white p-3 sm:p-4">
          <label className="mb-2 block text-sm font-medium text-gray-500">
            عنوان ملک
          </label>
          <Link
            onClick={(event) => {
              if (estate.status === ESTATE_STATUS.PENDING) {
                event.preventDefault();
              }
            }}
            href={`/estates/${estate.id}`}
            className="text-base font-semibold text-gray-900 transition-colors hover:text-primary sm:text-lg">
            {estate.title}
          </Link>
        </div>

        <div className="rounded-lg border border-primary-border/30 bg-white p-3 sm:p-4">
          <label className="mb-2 block text-sm font-medium text-gray-500">
            توضیحات
          </label>
          <p className="line-clamp-2 leading-relaxed text-gray-700">
            {estate.description || "توضیحی برای این ملک وجود ندارد"}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-primary-border/30 bg-white p-3 sm:p-4">
            <label className="mb-2 block text-sm font-medium text-gray-500">
              متراژ
            </label>
            <p className="text-base font-semibold text-gray-900 sm:text-lg">
              {estate.metrage.toLocaleString("fa-IR")} متر مربع
            </p>
          </div>

          <div className="rounded-lg border border-primary-border/30 bg-white p-3 sm:p-4">
            <label className="mb-2 block text-sm font-medium text-gray-500">
              کد ملک
            </label>
            <p className="font-mono text-base font-semibold text-gray-900 sm:text-lg">
              {estate.estateCode}
            </p>
          </div>
        </div>

        {estate.totalPrice && estate.metragePrice ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-primary-border/30 bg-white p-3 sm:p-4">
              <label className="mb-2 block text-sm font-medium text-gray-500">
                متراژ قیمت
              </label>
              <p className="text-base font-semibold text-gray-900 sm:text-lg">
                {Intl.NumberFormat("fa-IR").format(estate.metragePrice || 0)}{" "}
                تومان
              </p>
            </div>

            <div className="rounded-lg border border-primary-border/30 bg-white p-3 sm:p-4">
              <label className="mb-2 block text-sm font-medium text-gray-500">
                قیمت کل
              </label>
              <p className="text-base font-semibold text-gray-900 sm:text-lg">
                {Intl.NumberFormat("fa-IR").format(estate.totalPrice || 0)}{" "}
                تومان
              </p>
            </div>
          </div>
        ) : estate.rahnPrice && estate.ejarePrice ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-primary-border/30 bg-white p-3 sm:p-4">
              <label className="mb-2 block text-sm font-medium text-gray-500">
                قیمت رهن
              </label>
              <p className="text-base font-semibold text-gray-900 sm:text-lg">
                {Intl.NumberFormat("fa-IR").format(estate.rahnPrice || 0)} تومان
              </p>
            </div>

            <div className="rounded-lg border border-primary-border/30 bg-white p-3 sm:p-4">
              <label className="mb-2 block text-sm font-medium text-gray-500">
                قیمت اجاره
              </label>
              <p className="text-base font-semibold text-gray-900 sm:text-lg">
                {Intl.NumberFormat("fa-IR").format(estate.ejarePrice || 0)}{" "}
                تومان
              </p>
            </div>
          </div>
        ) : null}

        <div className="rounded-lg border border-primary-border/30 bg-white p-3 sm:p-4">
          <label className="mb-2 block text-sm font-medium text-gray-500">
            آدرس
          </label>
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-gray-400 max-sm:hidden" />
            <span className="leading-relaxed text-gray-700">
              {estate.address}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

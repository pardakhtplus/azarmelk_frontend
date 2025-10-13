"use client";

import { useState } from "react";
import SaleCommission from "./_components/SaleCommission";
import RentCommission from "./_components/RentCommission";

enum COMMISSION_TABS {
  SALE = "SALE",
  RENT = "RENT",
}

export default function CommissionPage() {
  const [activeTab, setActiveTab] = useState<"SALE" | "RENT">("SALE");

  return (
    <section className="container h-full w-full pb-[60px] pt-9">
      <div className="mx-auto flex h-fit w-full max-w-xl flex-col items-center rounded-3xl border-primary-border xs:border xs:px-7 xs:py-7 sm:px-10 sm:py-9">
        <h1 className="mb-5 text-xl font-semibold sm:text-2xl">
          محاسبه آنلاین کمیسیون
        </h1>

        <div className="relative z-[1] flex w-fit items-center rounded-full border border-primary-border p-1">
          <div className="absolute inset-0 -z-[1] flex size-full items-center p-1 transition-all">
            <div
              className="-z-[1] h-full w-32 rounded-full bg-primary transition-all duration-300"
              style={{
                transform:
                  activeTab === COMMISSION_TABS.SALE
                    ? "translateX(0)"
                    : activeTab === COMMISSION_TABS.RENT
                      ? "translateX(-100%)"
                      : "translateX(0)",
              }}
            />
          </div>
          <button
            className={`w-32 rounded-full py-2.5 text-sm transition-colors ${activeTab === COMMISSION_TABS.SALE ? "text-white" : "text-primary-300"}`}
            onClick={() => setActiveTab(COMMISSION_TABS.SALE)}>
            خرید و فروش
          </button>
          <button
            className={`w-32 rounded-full py-2.5 text-sm transition-colors ${activeTab === COMMISSION_TABS.RENT ? "text-white" : "text-primary-300"}`}
            onClick={() => setActiveTab(COMMISSION_TABS.RENT)}>
            رهن و اجاره
          </button>
        </div>

        {activeTab === COMMISSION_TABS.SALE ? (
          <SaleCommission />
        ) : (
          <RentCommission />
        )}
        <div className="mb-1 mt-8 space-y-2.5 rounded-lg border border-primary-blue/50 bg-primary-blue/10 p-4">
          <div className="flex items-start gap-x-2.5">
            <div className="mt-[5px] size-2.5 shrink-0 rounded-full bg-primary-blue" />
            <p className="text-sm text-primary">
              مبلغ فوق ، کمیسیون قانونی مصوب اتحادیه املاک تبریز می باشد. این
              مبلغ ، سهم هر یک طرف از کمیسیون معامله می باشد .
            </p>
          </div>
          <div className="flex items-start gap-x-2.5">
            <div className="mt-[5px] size-2.5 shrink-0 rounded-full bg-primary-blue" />
            <p className="text-sm text-primary">
              در مبلغ محاسبه شده ، ۱۰٪ ارزش افزوده دولت نیز لحاظ شده است .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

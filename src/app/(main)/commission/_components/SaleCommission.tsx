import Button from "@/components/modules/buttons/Button";
import BorderedInput from "@/components/modules/inputs/BorderedInput";
import { ArrowDownIcon } from "lucide-react";
import { useState } from "react";
import { calcSale } from "./CommissionsUtils";
import { unFormatNumber } from "@/lib/utils";
import { useUserInfo } from "@/services/queries/client/auth/useUserInfo";
import { Permissions } from "@/permissions/permission.types";

export default function SaleCommission() {
  const [selectedPercent, setSelectedPercent] = useState(0.0025);
  const [transactionValue, setTransactionValue] = useState("");
  const [commissionValue, setCommissionValue] = useState(0);
  const { userInfo } = useUserInfo();

  const isAdvisor = !userInfo?.data?.data.accessPerms.includes(
    Permissions.USER,
  );

  const handleCalcCommission = () => {
    const commissionResponse = calcSale(
      Number(unFormatNumber(transactionValue)),
      selectedPercent === 0.0025 ? undefined : selectedPercent,
    );

    setCommissionValue(commissionResponse.total);
  };

  return (
    <div className="w-full pt-8 sm:pt-10">
      <div>
        <p className="mb-3 text-xs font-light text-text-300">درصد کمیسیون</p>
        <div className="flex items-center gap-x-6 sm:gap-x-8">
          <label
            htmlFor="0.0025"
            className="flex items-center gap-x-1.5"
            defaultChecked>
            <input
              type="radio"
              id="0.0025"
              name="commission"
              className="size-5"
              checked={selectedPercent === 0.0025}
              onChange={() => {
                setSelectedPercent(0.0025);
              }}
            />
            <span>قانونی</span>
          </label>
          {isAdvisor && (
            <>
              <label htmlFor="0.01" className="flex items-center gap-x-1.5">
                <input
                  type="radio"
                  id="0.01"
                  name="commission"
                  className="size-5"
                  checked={selectedPercent === 0.01}
                  onChange={() => {
                    setSelectedPercent(0.01);
                  }}
                />
                <span>1%</span>
              </label>
              <label htmlFor="0.005" className="flex items-center gap-x-1.5">
                <input
                  type="radio"
                  id="0.005"
                  name="commission"
                  className="size-5"
                  checked={selectedPercent === 0.005}
                  onChange={() => {
                    setSelectedPercent(0.005);
                  }}
                />
                <span>0.5%</span>
              </label>
            </>
          )}
        </div>
      </div>
      <div className="pt-6 sm:pt-8">
        <p className="mb-3 text-xs font-light text-text-300">مبلغ معامله</p>
        <BorderedInput
          name="commission"
          isCurrency
          // value={commissionValue}
          onChange={(event) => {
            setTransactionValue(event.formattedValue);
            setCommissionValue(0);
          }}
          showCurrency
          currencyClassName="left-4"
        />
      </div>
      <Button
        disabled={!transactionValue}
        className="mt-6 w-full"
        onClick={handleCalcCommission}>
        <span>محاسبه کمیسیون</span>
        <ArrowDownIcon className="size-6" />
      </Button>
      {commissionValue ? (
        <div>
          <div className="mb-5 mt-8 flex items-center gap-x-4">
            <span className="shrink-0 text-sm">مبلغ کمیسیون</span>
            <div className="h-px w-full bg-primary-border" />
          </div>
          <div>
            <p className="flex items-center gap-x-1.5">
              <span className="text-2xl font-medium">
                {Number(commissionValue.toFixed(0)).toLocaleString("fa-IR")}
              </span>{" "}
              <span>تومان</span>
            </p>
            <p className="text-sm text-text-200">
              * مبلغ فوق، سهم هر طرف معامله از بابت کمیسیون معامله می باشد.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

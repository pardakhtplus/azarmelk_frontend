import Button from "@/components/modules/buttons/Button";
import BorderedInput from "@/components/modules/inputs/BorderedInput";
import { numberToPersianWords, unFormatNumber } from "@/lib/utils";
import { ArrowDownIcon } from "lucide-react";
import { useState } from "react";
import { calcRent } from "./CommissionsUtils";

export default function RentCommission() {
  const [rahnValue, setRahnValue] = useState("");
  const [ejareValue, setEjareValue] = useState("");
  const [commissionValue, setCommissionValue] = useState(0);

  const handleCalcCommission = () => {
    const commissionResponse = calcRent(
      Number(unFormatNumber(rahnValue)),
      Number(unFormatNumber(ejareValue)),
    );

    setCommissionValue(commissionResponse.total);
  };

  return (
    <div className="w-full pt-8 sm:pt-10">
      <div className="">
        <p className="mb-3 text-xs font-light text-text-300">مبلغ رهن</p>
        <BorderedInput
          name="rahn"
          isCurrency
          // value={commissionValue}
          onChange={(event) => {
            setRahnValue(event.formattedValue);
            setCommissionValue(0);
          }}
          showCurrency
          currencyClassName="left-4"
        />
        {rahnValue && (
          <p className="mt-1.5 text-xs">
            {numberToPersianWords(Number(unFormatNumber(rahnValue || "0")))}
          </p>
        )}
      </div>
      <div className="pt-6">
        <p className="mb-3 text-xs font-light text-text-300">مبلغ اجاره</p>
        <BorderedInput
          name="ejare"
          isCurrency
          // value={commissionValue}
          onChange={(event) => {
            setEjareValue(event.formattedValue);
            setCommissionValue(0);
          }}
          showCurrency
          currencyClassName="left-4"
        />
        {ejareValue && (
          <p className="mt-1.5 text-xs">
            {numberToPersianWords(Number(unFormatNumber(ejareValue || "0")))}
          </p>
        )}
      </div>
      <Button
        disabled={!ejareValue || !rahnValue}
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

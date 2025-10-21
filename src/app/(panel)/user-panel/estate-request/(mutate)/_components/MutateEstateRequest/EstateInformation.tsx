import ComboBox from "@/components/modules/ComboBox";
import ConditionalField from "@/components/modules/estate/ConditionalField";
import {
  AllCreateFileFields,
  floor,
  melkLocation,
  shopLocation,
} from "@/components/modules/estate/EstateUtils";
import BorderedInput from "@/components/modules/inputs/BorderedInput";
import { PropertyTypeEnum } from "@/lib/categories";
import { cn, numberToPersianWords, unFormatNumber } from "@/lib/utils";
import { type TCategory } from "@/types/admin/category/types";
import { type TEstateRequest } from "@/types/client/dashboard/estate/request/types";
import { useState } from "react";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { z } from "zod";
import { type mutateEstateRequestSchema } from "./MutateEstateRequest";
import SelectionItems from "@/app/(panel)/dashboard/estates/(mutate)/_components/MutateEstate/Features/SelectionItems";
import Features from "@/app/(panel)/dashboard/estates/(mutate)/_components/MutateEstate/Features/Features";

export default function EstateInformation({
  register,
  errors,
  setValue,
  watch,
  selectedCategories = [],
  defaultEstate,
}: {
  register: UseFormRegister<z.infer<typeof mutateEstateRequestSchema>>;
  errors: FieldErrors<z.infer<typeof mutateEstateRequestSchema>>;
  setValue: UseFormSetValue<z.infer<typeof mutateEstateRequestSchema>>;
  watch: UseFormWatch<z.infer<typeof mutateEstateRequestSchema>>;
  selectedCategories?: TCategory[];
  defaultEstate?: TEstateRequest;
}) {
  const [minRahnPrice, setMinRahnPrice] = useState<string | null>(
    defaultEstate?.minRahnPrice?.toString() || null,
  );
  const [maxRahnPrice, setMaxRahnPrice] = useState<string | null>(
    defaultEstate?.maxRahnPrice?.toString() || null,
  );
  const [minEjarePrice, setMinEjarePrice] = useState<string | null>(
    defaultEstate?.minEjarePrice?.toString() || null,
  );
  const [maxEjarePrice, setMaxEjarePrice] = useState<string | null>(
    defaultEstate?.maxEjarePrice?.toString() || null,
  );
  const [minMetragePrice, setMinMetragePrice] = useState<string | null>(
    defaultEstate?.minMetragePrice?.toString() || null,
  );
  const [maxMetragePrice, setMaxMetragePrice] = useState<string | null>(
    defaultEstate?.maxMetragePrice?.toString() || null,
  );
  const [minTotalPrice, setMinTotalPrice] = useState<string | null>(
    defaultEstate?.minTotalPrice?.toString() || null,
  );
  const [maxTotalPrice, setMaxTotalPrice] = useState<string | null>(
    defaultEstate?.maxTotalPrice?.toString() || null,
  );

  return (
    <div className="flex w-full flex-col gap-y-5">
      <div>
        <label htmlFor="title" className="text-sm">
          <span>عنوان</span>{" "}
          <span className="text-xs text-amber-500">(خودکار پر میشود)</span>
        </label>
        <BorderedInput
          name="title"
          type="text"
          containerClassName="mt-1"
          register={register}
          error={errors.title}
        />
      </div>
      {/* سال ساخت - نمایش شرطی */}
      <div className="flex items-start gap-x-4">
        <ConditionalField
          field={AllCreateFileFields.BUILD_YEAR}
          selectedCategories={selectedCategories}>
          <div className="w-full">
            <label htmlFor="" className="text-sm">
              سال ساخت
            </label>
            <ComboBox
              value={watch("buildYear")?.toString() || ""}
              onChange={(option) => setValue("buildYear", option.key)}
              containerClassName="mt-1"
              options={Array.from({ length: 91 }, (_, i) => ({
                key: `${1430 - i}`,
                title: `${1430 - i}`,
                value: `${1430 - i}`,
              }))}
              dropDownClassName="w-full"
            />
          </div>
        </ConditionalField>
      </div>
      <div className="flex items-start gap-x-4">
        <div className="w-full">
          <label htmlFor="metrage" className="text-sm">
            حداقل متراژ
          </label>
          <BorderedInput
            name="minMetrage"
            type="number"
            containerClassName="mt-1"
            register={register}
            error={errors.minMetrage}
          />
        </div>
        <div className="w-full">
          <label htmlFor="metrage" className="text-sm">
            حداکثر متراژ
          </label>
          <BorderedInput
            name="maxMetrage"
            type="number"
            containerClassName="mt-1"
            register={register}
            error={errors.maxMetrage}
          />
        </div>
      </div>
      {/* تعداد اتاق - نمایش شرطی */}
      <div className="w-full">
        <label htmlFor="" className="text-sm">
          تعداد اتاق
        </label>
        <ComboBox
          value={watch("roomCount")?.toString() || ""}
          onChange={(option) => setValue("roomCount", option.key)}
          containerClassName="mt-1"
          options={Array.from({ length: 10 }, (_, i) => ({
            key: `${i + 1}`,
            title: `${i + 1}`,
            value: `${i + 1}`,
          }))}
          dropDownClassName="w-full"
        />
      </div>
      {/* طبقه و تعداد طبقات - نمایش شرطی */}
      <div className="flex w-full flex-col items-start gap-4 sm:flex-row">
        <div className="w-full">
          <label htmlFor="" className="text-sm">
            حداقل طبقه
          </label>
          <ComboBox
            value={watch("minFloor") || ""}
            onChange={(option) => setValue("minFloor", option.key)}
            containerClassName="mt-1"
            options={floor.map((item) => ({
              key: item,
              title: item,
              value: item,
            }))}
            dropDownClassName="w-full"
          />
        </div>
        <div className="w-full">
          <label htmlFor="" className="text-sm">
            حداکثر طبقه
          </label>
          <ComboBox
            value={watch("maxFloor")?.toString() || ""}
            onChange={(option) => setValue("maxFloor", option.key)}
            containerClassName="mt-1"
            options={Array.from({ length: 30 }, (_, i) => ({
              key: `${i + 1}`,
              title: `${i + 1}`,
              value: `${i + 1}`,
            }))}
            dropDownClassName="w-full"
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-4 sm:flex-row">
        <div className="w-full">
          <label htmlFor="floorCount" className="text-sm">
            تعداد کل طبقات
          </label>
          <BorderedInput
            name="floorCount"
            type="number"
            containerClassName="mt-1"
            register={register}
            error={errors.floorCount}
          />
        </div>
        <div className="w-full">
          <label htmlFor="floorUnitCount" className="text-sm">
            تعداد واحد در طبقه
          </label>
          <BorderedInput
            name="floorUnitCount"
            type="number"
            containerClassName="mt-1"
            register={register}
            error={errors.floorUnitCount}
          />
        </div>
      </div>

      {selectedCategories?.[0]?.dealType === "FOR_RENT" ? (
        <>
          {/* قیمت رهن و اجاره - نمایش شرطی */}
          <ConditionalField
            field={AllCreateFileFields.RAHN_PRICE}
            selectedCategories={selectedCategories}>
            <div className="flex flex-col items-start gap-4">
              <div className="flex items-start gap-x-4">
                <div className="w-full">
                  <label htmlFor="minRahnPrice" className="text-sm">
                    حداقل قیمت رهن
                  </label>
                  <BorderedInput
                    defaultValue={watch("minRahnPrice")}
                    name="minRahnPrice"
                    type="number"
                    containerClassName="mt-1"
                    register={register}
                    error={errors.minRahnPrice}
                    showCurrency
                    isCurrency
                    onChange={(event) => {
                      setMinRahnPrice(unFormatNumber(event.target.value));
                    }}
                  />
                  {minRahnPrice && (
                    <p className="mt-1.5 text-xs">
                      {numberToPersianWords(
                        Number(unFormatNumber(minRahnPrice || "0")),
                      )}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <label htmlFor="maxRahnPrice" className="text-sm">
                    حداکثر قیمت رهن
                  </label>
                  <BorderedInput
                    defaultValue={watch("maxRahnPrice")}
                    name="maxRahnPrice"
                    type="number"
                    containerClassName="mt-1"
                    register={register}
                    error={errors.maxRahnPrice}
                    showCurrency
                    isCurrency
                    onChange={(event) => {
                      setMaxRahnPrice(unFormatNumber(event.target.value));
                    }}
                  />
                  {maxRahnPrice && (
                    <p className="mt-1.5 text-xs">
                      {numberToPersianWords(
                        Number(unFormatNumber(maxRahnPrice || "0")),
                      )}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-x-4">
                <div className="w-full">
                  <label htmlFor="minEjarePrice" className="text-sm">
                    حداقل قیمت اجاره
                  </label>
                  <BorderedInput
                    defaultValue={watch("minEjarePrice")}
                    name="minEjarePrice"
                    type="number"
                    containerClassName="mt-1"
                    register={register}
                    error={errors.minEjarePrice}
                    showCurrency
                    isCurrency
                    onChange={(event) => {
                      setMinEjarePrice(event.target.value);
                    }}
                  />
                  {minEjarePrice && (
                    <p className="mt-1.5 text-xs">
                      {numberToPersianWords(
                        Number(unFormatNumber(minEjarePrice || "0")),
                      )}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <label htmlFor="maxEjarePrice" className="text-sm">
                    حداکثر قیمت اجاره
                  </label>
                  <BorderedInput
                    defaultValue={watch("maxEjarePrice")}
                    name="maxEjarePrice"
                    type="number"
                    containerClassName="mt-1"
                    register={register}
                    error={errors.maxEjarePrice}
                    showCurrency
                    isCurrency
                    onChange={(event) => {
                      setMaxEjarePrice(event.target.value);
                    }}
                  />
                  {maxEjarePrice && (
                    <p className="mt-1.5 text-xs">
                      {numberToPersianWords(
                        Number(unFormatNumber(maxEjarePrice || "0")),
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </ConditionalField>
        </>
      ) : (
        <>
          {/* قیمت هر متر و قیمت کل - نمایش شرطی */}
          <ConditionalField
            field={AllCreateFileFields.TOTAL_PRICE}
            selectedCategories={selectedCategories}>
            <div className="flex flex-col items-start gap-4">
              <div className="flex w-full flex-col items-start gap-4 sm:flex-row">
                <div className="w-full">
                  <label htmlFor="minMetragePrice" className="text-sm">
                    حداقل قیمت هر متر
                  </label>
                  <BorderedInput
                    defaultValue={watch("minMetragePrice")}
                    name="minMetragePrice"
                    type="number"
                    containerClassName="mt-1"
                    register={register}
                    error={errors.minMetragePrice}
                    value={minMetragePrice || ""}
                    isCurrency
                    showCurrency
                    onChange={(event) => {
                      setMinMetragePrice(unFormatNumber(event.target.value));
                    }}
                  />
                  {minMetragePrice && (
                    <p className="mt-1.5 text-xs">
                      {numberToPersianWords(
                        Number(unFormatNumber(minMetragePrice || "0")),
                      )}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <label htmlFor="maxMetragePrice" className="text-sm">
                    حداکثر قیمت هر متر
                  </label>
                  <BorderedInput
                    defaultValue={watch("maxMetragePrice")}
                    name="maxMetragePrice"
                    type="number"
                    containerClassName="mt-1"
                    register={register}
                    error={errors.minMetragePrice}
                    value={maxMetragePrice || ""}
                    isCurrency
                    showCurrency
                    onChange={(event) => {
                      setMaxMetragePrice(unFormatNumber(event.target.value));
                    }}
                  />
                  {maxMetragePrice && (
                    <p className="mt-1.5 text-xs">
                      {numberToPersianWords(
                        Number(unFormatNumber(maxMetragePrice || "0")),
                      )}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex w-full flex-col items-start gap-4 sm:flex-row">
                <div className="w-full">
                  <label htmlFor="minTotalPrice" className="text-sm">
                    حداقل قیمت کل
                  </label>
                  <BorderedInput
                    defaultValue={watch("minTotalPrice")}
                    name="minTotalPrice"
                    type="number"
                    containerClassName="mt-1"
                    register={register}
                    error={errors.minTotalPrice}
                    value={minTotalPrice || ""}
                    isCurrency
                    showCurrency
                    onChange={(event) => {
                      setMinTotalPrice(unFormatNumber(event.target.value));
                    }}
                  />
                  {minTotalPrice && (
                    <p className="mt-1.5 text-xs">
                      {numberToPersianWords(
                        Number(unFormatNumber(minTotalPrice || "0")),
                      )}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <label htmlFor="maxTotalPrice" className="text-sm">
                    حداکثر قیمت کل
                  </label>
                  <BorderedInput
                    defaultValue={watch("maxTotalPrice")}
                    name="maxTotalPrice"
                    type="number"
                    containerClassName="mt-1"
                    register={register}
                    error={errors.maxTotalPrice}
                    value={maxTotalPrice || ""}
                    isCurrency
                    showCurrency
                    onChange={(event) => {
                      setMaxTotalPrice(unFormatNumber(event.target.value));
                    }}
                  />
                  {maxTotalPrice && (
                    <p className="mt-1.5 text-xs">
                      {numberToPersianWords(
                        Number(unFormatNumber(maxTotalPrice || "0")),
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </ConditionalField>
        </>
      )}
      {/* توضیحات - همیشه نمایش داده شود */}
      <div className="w-full">
        <label htmlFor="description" className="text-sm">
          توضیحات <span className="text-text-200">(جهت اطلاع مشتریان)</span>
        </label>
        <div className="w-full">
          <textarea
            id="description"
            className={cn(
              "mt-2 w-full rounded-xl border border-primary-border p-2.5 outline-none focus:border-black",
              errors.description && "border-red",
            )}
            rows={3}
            {...register("description")}
          />
          {errors.description && (
            <p className="text-xs text-red">{errors.description.message}</p>
          )}
        </div>
      </div>
      {/* موقعیت ملک - نمایش شرطی */}
      <ConditionalField
        field={AllCreateFileFields.LOCATION}
        selectedCategories={selectedCategories}>
        <div className="pt-6">
          <p className="-mb-0.5 font-medium">موقعیت ملک</p>
          <SelectionItems
            items={
              selectedCategories?.[2]?.propertyType === PropertyTypeEnum.SHOP
                ? shopLocation
                : melkLocation
            }
            selectedItems={watch("location") || []}
            setSelectedItems={(items) => {
              setValue("location", items as string[]);
            }}
            multiple
            containerClassName="mt-6"
          />
        </div>
        {errors.location && (
          <p className="text-xs text-red">{errors.location.message}</p>
        )}
      </ConditionalField>
      {/* امکانات - همیشه نمایش داده شود */}
      <Features
        // @ts-expect-error not
        watch={watch}
        // @ts-expect-error not
        setValue={setValue}
        selectedCategories={selectedCategories}
      />
    </div>
  );
}

import ComboBox from "@/components/modules/ComboBox";
import CustomSwitch from "@/components/modules/CustomSwitch";
import ConditionalField from "@/components/modules/estate/ConditionalField";
import {
  AllCreateFileFields,
  createEstateNameByCategories,
  findBy,
  floor,
  melkLocation,
  shopLocation,
} from "@/components/modules/estate/EstateUtils";
import BorderedInput from "@/components/modules/inputs/BorderedInput";
import { PropertyTypeEnum } from "@/lib/categories";
import {
  cn,
  formatNumber,
  numberToPersianWords,
  unFormatNumber,
} from "@/lib/utils";
import { Permissions } from "@/permissions/permission.types";
import { useUserInfo } from "@/services/queries/client/auth/useUserInfo";
import { type TCategory } from "@/types/admin/category/types";
import { type TEstate } from "@/types/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type {
  Control,
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { z } from "zod";
import AdvisorSelector from "./AdvisorSelector";
import EstateNotes from "./EstateNotes";
import EstateOwner from "./EstateOwner/EstateOwner";
import Features from "./Features/Features";
import SelectionItems from "./Features/SelectionItems";
import { type mutateEstateSchema } from "./MutateEstate";

export default function EstateInformation({
  register,
  errors,
  setValue,
  watch,
  control,
  selectedCategories = [],
  selectedRegion,
  clearErrors,
  isEditing,
  canViewOwners = true,
  canViewAddress = true,
  defaultEstate,
  isUserPanel,
}: {
  register: UseFormRegister<z.infer<typeof mutateEstateSchema>>;
  errors: FieldErrors<z.infer<typeof mutateEstateSchema>>;
  setValue: UseFormSetValue<z.infer<typeof mutateEstateSchema>>;
  watch: UseFormWatch<z.infer<typeof mutateEstateSchema>>;
  selectedCategories?: TCategory[];
  control: Control<z.infer<typeof mutateEstateSchema>>;
  selectedRegion?: TCategory | null;
  clearErrors: UseFormClearErrors<z.infer<typeof mutateEstateSchema>>;
  isEditing?: boolean;
  canViewOwners?: boolean;
  canViewAddress?: boolean;
  defaultEstate?: TEstate;
  isUserPanel?: boolean;
}) {
  const [isNegotiable, setIsNegotiable] = useState(
    watch("note") ? true : false,
  );
  const { userInfo } = useUserInfo();
  const { id } = useParams<{ id: string }>();
  const [rahnPrice, setRahnPrice] = useState<string | null>(
    defaultEstate?.rahnPrice?.toString() || null,
  );
  const [ejarePrice, setEjarePrice] = useState<string | null>(
    defaultEstate?.ejarePrice?.toString() || null,
  );
  const [metragePrice, setMetragePrice] = useState<string | null>(
    defaultEstate?.metragePrice?.toString() || null,
  );
  const [totalPrice, setTotalPrice] = useState<string | null>(
    defaultEstate?.totalPrice?.toString() || null,
  );

  const note = watch("note");

  useEffect(() => {
    if (note) {
      setIsNegotiable(true);
    }
  }, [note]);

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
      {canViewOwners && (
        <div>
          <label htmlFor="" className="text-sm">
            اطلاعات مالک
          </label>
          <EstateOwner
            control={control}
            categoryId={selectedRegion?.id}
            errors={errors}
            clearErrors={clearErrors}
            isUserPanel={isUserPanel}
          />
        </div>
      )}

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
              value={watch("buildYear")}
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
        <div className="w-full">
          <label htmlFor="metrage" className="text-sm">
            متراژ
          </label>
          <BorderedInput
            name="metrage"
            type="number"
            containerClassName="mt-1"
            register={register}
            error={errors.metrage}
            onInput={(event) => {
              setValue(
                "title",
                createEstateNameByCategories(
                  [
                    ...(selectedCategories || []),
                    selectedRegion || { name: "" },
                  ],
                  Number(event.currentTarget.value),
                ),
              );
            }}
          />
        </div>
      </div>

      {/* متراژ سوله - نمایش شرطی */}
      <ConditionalField
        field={AllCreateFileFields.SOLE_METRAGE}
        selectedCategories={selectedCategories}>
        <div className="w-full">
          <label htmlFor="soleMetrage" className="text-sm">
            متراژ سوله
          </label>
          <BorderedInput
            name="soleMetrage"
            type="number"
            containerClassName="mt-1"
            register={register}
            error={errors.soleMetrage}
          />
        </div>
      </ConditionalField>

      {/* تعداد اتاق - نمایش شرطی */}
      <ConditionalField
        field={AllCreateFileFields.ROOM_COUNT}
        selectedCategories={selectedCategories}>
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
      </ConditionalField>

      {/* طبقه و تعداد طبقات - نمایش شرطی */}
      <ConditionalField
        field={AllCreateFileFields.FLOOR}
        selectedCategories={selectedCategories}>
        <div className="flex items-start gap-x-4">
          <div className="w-full">
            <label htmlFor="" className="text-sm">
              طبقه
            </label>
            <ComboBox
              value={watch("floor") || ""}
              onChange={(option) => setValue("floor", option.key)}
              containerClassName="mt-1"
              options={floor.map((item) => ({
                key: item,
                title: item,
                value: item,
              }))}
              dropDownClassName="w-full"
            />
          </div>
          <p className="mb-3.5 mt-auto text-text-200">از</p>
          <div className="w-full">
            <label htmlFor="" className="text-sm">
              کل طبقات
            </label>
            <ComboBox
              value={watch("floorCount")?.toString() || ""}
              onChange={(option) => setValue("floorCount", option.key)}
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
      </ConditionalField>

      {/* آدرس - نمایش بر اساس مجوز */}
      {canViewAddress && (
        <div className="w-full">
          <label htmlFor="address" className="text-sm">
            آدرس <span className="text-text-200">(جهت اطلاع همکاران)</span>
          </label>
          <div className="relative">
            <textarea
              id="address"
              className={cn(
                "mt-2 w-full rounded-xl border border-primary-border p-2.5 outline-none focus:border-black",
                errors.address && "border-red",
              )}
              rows={3}
              {...register("address")}
            />
            {errors.address && (
              <p className="text-xs text-red">{errors.address.message}</p>
            )}
          </div>
        </div>
      )}
      <div className="w-full">
        <label htmlFor="approximateAddress" className="text-sm">
          آدرس حدودی <span className="text-text-200">(جهت اطلاع مشتریان)</span>
        </label>
        <BorderedInput
          name="approximateAddress"
          type="text"
          containerClassName="mt-1"
          register={register}
          error={errors.approximateAddress}
        />
      </div>

      {/* تعداد واحد در طبقه - نمایش شرطی */}
      <ConditionalField
        field={AllCreateFileFields.FLOOR_UNIT_COUNT}
        selectedCategories={selectedCategories}>
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
      </ConditionalField>

      {/* متراژ کف - نمایش شرطی */}
      <ConditionalField
        field={AllCreateFileFields.FLOOR_METRAGE}
        selectedCategories={selectedCategories}>
        <div className="w-full">
          <label htmlFor="floorMetrage" className="text-sm">
            متراژ کف
          </label>
          <BorderedInput
            name="floorMetrage"
            type="number"
            containerClassName="mt-1"
            register={register}
            error={errors.floorMetrage}
          />
        </div>
      </ConditionalField>

      {/* متراژ دهنه - نمایش شرطی */}
      <ConditionalField
        field={AllCreateFileFields.DAHANE_METRAGE}
        selectedCategories={selectedCategories}>
        <div className="w-full">
          <label htmlFor="dahaneMetrage" className="text-sm">
            متراژ دهنه
          </label>
          <BorderedInput
            name="dahaneMetrage"
            type="number"
            containerClassName="mt-1"
            register={register}
            error={errors.dahaneMetrage}
          />
        </div>
      </ConditionalField>

      {/* ارتفاع سقف - نمایش شرطی */}
      <ConditionalField
        field={AllCreateFileFields.HEIGHT}
        selectedCategories={selectedCategories}>
        <div className="w-full">
          <label htmlFor="height" className="text-sm">
            ارتفاع سقف
          </label>
          <BorderedInput
            name="height"
            type="number"
            containerClassName="mt-1"
            register={register}
            error={errors.height}
          />
        </div>
      </ConditionalField>

      {/* انبار تجاری - نمایش شرطی */}
      <ConditionalField
        field={AllCreateFileFields.INVENTORY}
        selectedCategories={selectedCategories}>
        <div className="w-full">
          <label htmlFor="inventory" className="text-sm">
            انبار تجاری
          </label>
          <BorderedInput
            name="inventory"
            type="number"
            containerClassName="mt-1"
            register={register}
            error={errors.inventory}
          />
        </div>
      </ConditionalField>

      {/* عرض ملک - نمایش شرطی */}
      <ConditionalField
        field={AllCreateFileFields.ARZ_MELK}
        selectedCategories={selectedCategories}>
        <div className="w-full">
          <label htmlFor="arzMelk" className="text-sm">
            عرض ملک
          </label>
          <BorderedInput
            name="arzMelk"
            type="number"
            containerClassName="mt-1"
            register={register}
            error={errors.arzMelk}
          />
        </div>
      </ConditionalField>

      {/* عرض گذر - نمایش شرطی */}
      <ConditionalField
        field={AllCreateFileFields.ARZ_GOZAR}
        selectedCategories={selectedCategories}>
        <div className="w-full">
          <label htmlFor="arzGozar" className="text-sm">
            عرض گذر
          </label>
          <BorderedInput
            name="arzGozar"
            type="number"
            containerClassName="mt-1"
            register={register}
            error={errors.arzGozar}
          />
        </div>
      </ConditionalField>

      {/* طول ملک - نمایش شرطی */}
      <ConditionalField
        field={AllCreateFileFields.TOL_MELK}
        selectedCategories={selectedCategories}>
        <div className="w-full">
          <label htmlFor="tolMelk" className="text-sm">
            طول ملک
          </label>
          <BorderedInput
            name="tolMelk"
            type="number"
            containerClassName="mt-1"
            register={register}
            error={errors.tolMelk}
          />
        </div>
      </ConditionalField>

      {/* متراژ بنا - نمایش شرطی */}
      <ConditionalField
        field={AllCreateFileFields.BANA_METRAGE}
        selectedCategories={selectedCategories}>
        <div className="w-full">
          <label htmlFor="banaMetrage" className="text-sm">
            متراژ بنا
          </label>
          <BorderedInput
            name="banaMetrage"
            type="number"
            containerClassName="mt-1"
            register={register}
            error={errors.banaMetrage}
          />
        </div>
      </ConditionalField>

      <ConditionalField
        field={AllCreateFileFields.AYAN_METRAGE}
        selectedCategories={selectedCategories}>
        <div className="w-full">
          <label htmlFor="ayanMetrage" className="text-sm">
            متراژ اعیان
          </label>
          <BorderedInput
            name="ayanMetrage"
            type="number"
            containerClassName="mt-1"
            register={register}
            error={errors.ayanMetrage}
          />
        </div>
      </ConditionalField>

      <ConditionalField
        field={AllCreateFileFields.PARKING_COUNT}
        selectedCategories={selectedCategories}>
        <div className="w-full">
          <label htmlFor="parkingCount" className="text-sm">
            تعداد پارکینگ
          </label>
          <BorderedInput
            name="parkingCount"
            type="number"
            containerClassName="mt-1"
            placeholder="تعداد پارکینگ"
            value={watch("parkingCount")?.toString() || ""}
            onChange={(e) => {
              const value = e.target.value ? e.target.value : undefined;
              setValue("parkingCount", value, {
                shouldValidate: true,
              });
            }}
          />
        </div>
      </ConditionalField>

      {selectedCategories?.[0]?.dealType === "FOR_RENT" ? (
        <>
          {/* قیمت رهن و اجاره - نمایش شرطی */}
          <ConditionalField
            field={AllCreateFileFields.RAHN_PRICE}
            selectedCategories={selectedCategories}>
            <div className="flex flex-col items-start gap-4 sm:flex-row">
              <div className="w-full">
                <label htmlFor="rahnPrice" className="text-sm">
                  قیمت رهن
                </label>
                <BorderedInput
                  defaultValue={watch("rahnPrice")}
                  name="rahnPrice"
                  type="text"
                  containerClassName="mt-1"
                  register={register}
                  error={errors.rahnPrice}
                  showCurrency
                  isCurrency
                  onChange={(event) => {
                    setRahnPrice(event.target.value);
                  }}
                />
                {rahnPrice && (
                  <p className="mt-1.5 text-xs">
                    {numberToPersianWords(
                      Number(unFormatNumber(rahnPrice || "0")),
                    )}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label htmlFor="ejarePrice" className="text-sm">
                  قیمت اجاره
                </label>
                <BorderedInput
                  defaultValue={watch("ejarePrice")}
                  name="ejarePrice"
                  type="text"
                  containerClassName="mt-1"
                  register={register}
                  error={errors.ejarePrice}
                  showCurrency
                  isCurrency
                  onChange={(event) => {
                    setEjarePrice(event.target.value);
                  }}
                />
                {ejarePrice && (
                  <p className="mt-1.5 text-xs">
                    {numberToPersianWords(
                      Number(unFormatNumber(ejarePrice || "0")),
                    )}
                  </p>
                )}
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
            <div className="flex flex-col items-start gap-4 sm:flex-row">
              <div className="w-full">
                <label htmlFor="metragePrice" className="text-sm">
                  قیمت هر متر
                </label>
                <BorderedInput
                  defaultValue={watch("metragePrice")}
                  name="metragePrice"
                  type="text"
                  containerClassName="mt-1"
                  register={register}
                  error={errors.metragePrice}
                  value={watch("metragePrice")}
                  isCurrency
                  showCurrency
                  onChange={(event) => {
                    setMetragePrice(unFormatNumber(event.target.value));
                    if (watch("metrage")) {
                      setValue(
                        "totalPrice",
                        formatNumber(
                          (
                            Number(unFormatNumber(event.target.value)) *
                            Number(watch("metrage"))
                          )
                            .toFixed(0)
                            .toString(),
                        ),
                      );
                      setTotalPrice(
                        (
                          Number(unFormatNumber(event.target.value)) *
                          Number(watch("metrage"))
                        )
                          .toFixed(0)
                          .toString(),
                      );
                    }
                  }}
                />
                {metragePrice && (
                  <p className="mt-1.5 text-xs">
                    {numberToPersianWords(
                      Number(unFormatNumber(metragePrice || "0")),
                    )}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label htmlFor="totalPrice" className="text-sm">
                  قیمت کل
                </label>
                <BorderedInput
                  defaultValue={watch("totalPrice")}
                  name="totalPrice"
                  type="text"
                  containerClassName="mt-1"
                  register={register}
                  error={errors.totalPrice}
                  value={watch("totalPrice")}
                  isCurrency
                  showCurrency
                  onChange={(event) => {
                    setTotalPrice(event.target.value);
                    if (watch("metrage")) {
                      setValue(
                        "metragePrice",
                        formatNumber(
                          (
                            Number(unFormatNumber(event.target.value)) /
                            Number(watch("metrage"))
                          )
                            .toFixed(0)
                            .toString(),
                        ),
                      );
                    }
                  }}
                />
                {totalPrice && (
                  <p className="mt-1.5 text-xs">
                    {numberToPersianWords(
                      Number(unFormatNumber(totalPrice || "0")),
                    )}
                  </p>
                )}
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

      {/* قابل معاوضه - همیشه نمایش داده شود */}
      <div className="flex items-center gap-x-6">
        <p className="-mb-0.5 text-sm">قابل معاوضه</p>
        <CustomSwitch
          onChange={() => {
            setIsNegotiable(!isNegotiable);
            if (isNegotiable) {
              setValue("note", "");
            }
          }}
          checked={isNegotiable}
          className="h-5 w-9"
        />
      </div>
      {isNegotiable && (
        <div className="w-full">
          <label htmlFor="note" className="text-sm">
            <span>یادداشت قابل معاوضه </span>
            <span className="text-text-200">(جهت اطلاع همکاران)</span>
          </label>
          <div className="w-full">
            <textarea
              id="note"
              className={cn(
                "mt-2 w-full rounded-xl border border-primary-border p-2.5 outline-none focus:border-black",
                errors.note && "border-red",
              )}
              rows={3}
              {...register("note")}
            />
            {errors.note && (
              <p className="text-xs text-red">{errors.note.message}</p>
            )}
          </div>
        </div>
      )}

      {/* فایل یابی از طریق - نمایش شرطی */}
      {isUserPanel ? null : (
        <ConditionalField
          field={AllCreateFileFields.FIND_BY}
          selectedCategories={selectedCategories}>
          <div className="pt-6">
            <p className="-mb-0.5 font-medium">فایل یابی از طریق</p>
            <div className="mt-6 flex w-full flex-wrap items-center gap-6">
              {findBy.map((item) => (
                <div
                  key={item}
                  className="flex select-none items-center gap-x-2">
                  <div className="cntr">
                    <input
                      type="checkbox"
                      id={`cbx-${item}`}
                      className="checkbox hidden-xs-up"
                      checked={watch("findBy") === item}
                      onChange={(event) => {
                        if (event.target.checked) {
                          setValue("findBy", item);
                        } else {
                          setValue("findBy", undefined);
                        }
                      }}
                    />
                    <label htmlFor={`cbx-${item}`} className="cbx" />
                  </div>
                  <label htmlFor={`cbx-${item}`}>{item}</label>
                </div>
              ))}
            </div>
          </div>
        </ConditionalField>
      )}

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
        watch={watch}
        setValue={setValue}
        selectedCategories={selectedCategories}
      />

      {/* یادداشت ها - در ایجاد فیلد ساده و در ویرایش مدیریت کامل */}
      {isUserPanel ? null : isEditing && id ? (
        <EstateNotes estateId={id} />
      ) : (
        <div className="mt-4 w-full">
          <label htmlFor="estateNote" className="font-medium">
            گزارش کارشناسی{" "}
            <span className="text-text-200">(جهت اطلاع همکاران)</span>
          </label>
          <div className="w-full">
            <textarea
              id="estateNote"
              className={cn(
                "mt-2 w-full rounded-xl border border-primary-border p-2.5 outline-none focus:border-black",
                errors.estateNote && "border-red",
              )}
              rows={3}
              {...register("estateNote")}
            />
            {errors.estateNote && (
              <p className="text-xs text-red">{errors.estateNote.message}</p>
            )}
          </div>
        </div>
      )}

      {/* انتخاب مشاور */}
      {isUserPanel
        ? null
        : (userInfo?.data?.data.accessPerms.includes(Permissions.SUPER_USER) ||
            userInfo?.data?.data.accessPerms.includes(Permissions.OWNER)) && (
            <div className="mt-4 w-full">
              <label htmlFor="adviserId" className="text-sm">
                مشاور
              </label>
              <AdvisorSelector
                value={watch("adviserId")}
                onChange={(adviserId) => setValue("adviserId", adviserId)}
                error={errors.adviserId}
              />
            </div>
          )}
    </div>
  );
}

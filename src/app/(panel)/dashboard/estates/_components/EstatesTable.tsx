import { ICopy, IToman } from "@/components/Icons";
import Button from "@/components/modules/buttons/Button";
import {
  AllCreateFileFields,
  getStatusInfo,
} from "@/components/modules/estate/EstateUtils";
import Modal from "@/components/modules/Modal";
import { type ESTATE_ARCHIVE_STATUS, type ESTATE_STATUS } from "@/enums";
import { cn } from "@/lib/utils";
import { type TGetEstateList } from "@/types/admin/estate/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import EstateActions from "./EstateActions";
import { type ITableField } from "./EstatesContainer";
import OwnersModal from "./OwnersModal";

export default function EstatesTable({
  visibleTableFields,
  data,
}: {
  visibleTableFields: ITableField[];
  data?: TGetEstateList | null;
}) {
  return (
    <>
      <style type="text/css">
        {`
                .table-container {
                  width: 100%; /* Set the container width to 100% */
                  overflow-x: auto; /* Add horizontal scrollbar when content exceeds the container width */
                  padding-left: 1px;
                  overflow-y: visible; /* Allow vertical overflow for Portal menus */
                }

                .table {
                  width: 100%; /* Set the table width to 100% */
                  min-width: max-content;     
                  border-collapse: collapse;
                  font-size: 14px;
                  border-right: 1px solid #e0e0e0;
                  border-left: 1px solid #e0e0e0;
                  -webkit-user-select: none;  /* Safari */
                  -ms-user-select: none;      /* IE 10 and IE 11 */
                  user-select: none;  
                }

                .table th,
                .table td {
                  padding: 20px 15px;
                  text-align: start;
                  border-bottom: 1px solid #e0e0e0;
                  
                }

                .table td p {
                  margin: 0;
                  display: block;
                  white-space: normal;
                  overflow: visible;
                  word-break: break-word;
                  overflow-wrap: anywhere;
                }

                /* Alternate column backgrounds (even columns) */
                .table tbody td:nth-child(even) {
                  background-color: #f8f8f8;
                }

                /* Match header for even columns */
                .table thead th:nth-child(even) {
                  background-color: #ededed;
                }

                /* Sticky header */
                .table thead th {
                  position: sticky;
                  top: 0;
                  z-index: 2;
                }

                /* Row hover */
                .table tbody tr:hover td {
                  background-color: #f3f6f9;
                }
 
                .table th {
                  background-color: #f2f2f2;
                }
              `}
      </style>
      <div className="mt-5 grid w-full">
        <div
          className="table-container custom-scrollbar border-primary-border"
          style={{
            position: "relative",
          }}>
          <table className="table">
            <thead>
              <tr>
                <th className="">عملیات</th>

                {visibleTableFields.map((header) => {
                  if (!header.isVisible) return null;

                  return <th key={header.field}>{header.fieldName}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((item, index) => {
                return (
                  <tr key={item.id}>
                    <td className="">
                      <EstateActions
                        estate={item}
                        title={item.title}
                        menuClassName={cn(index === 0 && "top-0 bottom-auto")}
                        status={item.status}
                        archiveStatus={item.archiveStatus}
                        isLastRow={index === (data?.data?.length || 0) - 1}
                        isOneToLast={index === (data?.data?.length || 0) - 2}
                        isTableView={true}
                      />
                    </td>
                    {visibleTableFields.map((field) => {
                      if (!field.isVisible) return null;

                      if (field.field === AllCreateFileFields.ADDRESS) {
                        return (
                          <td key={field.field}>
                            <AddressCell address={item[field.field] || "__"} />
                          </td>
                        );
                      }

                      if (field.field === AllCreateFileFields.OWNERS) {
                        return (
                          <td key={field.field}>
                            <OwnersCell owners={item.owners || []} />
                          </td>
                        );
                      }

                      // if (
                      //   field.field === AllCreateFileFields.APPROXIMATE_ADDRESS
                      // ) {
                      //   return (
                      //     <td key={field.field}>
                      //       <TruncatedTableCell
                      //         text={item[field.field] || "__"}
                      //         maxLength={5}
                      //       />
                      //     </td>
                      //   );
                      // }

                      if (
                        field.field === AllCreateFileFields.TOTAL_PRICE ||
                        field.field === AllCreateFileFields.METRAGE_PRICE ||
                        field.field === AllCreateFileFields.RAHN_PRICE ||
                        field.field === AllCreateFileFields.EJARE_PRICE
                      ) {
                        return (
                          <td key={field.field}>
                            <span className="flex w-fit max-w-[300px] shrink-0 items-center gap-[0.5px]">
                              <span className="text-base">
                                {typeof item[field.field] === "number"
                                  ? item[field.field].toLocaleString("fa-IR")
                                  : "__"}
                              </span>
                              <IToman className="size-[16px]" />
                            </span>
                          </td>
                        );
                      }

                      if (field.field === AllCreateFileFields.STATUS) {
                        const { publishStatus } = getStatusInfo(
                          item.status as ESTATE_STATUS,
                          item.archiveStatus as ESTATE_ARCHIVE_STATUS,
                        );
                        return (
                          <td key={field.field}>
                            <span
                              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${publishStatus?.bgColor} ${publishStatus?.textColor}`}>
                              {publishStatus?.label}
                            </span>
                          </td>
                        );
                      }

                      if (field.field === AllCreateFileFields.ARCHIVE_STATUS) {
                        const { archiveStatus } = getStatusInfo(
                          item.status as ESTATE_STATUS,
                          item.archiveStatus as ESTATE_ARCHIVE_STATUS,
                        );

                        if (!archiveStatus)
                          return (
                            <td key={field.field}>
                              <span className="inline-flex items-center px-3 py-1">
                                __
                              </span>
                            </td>
                          );

                        return (
                          <td key={field.field}>
                            <span
                              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${archiveStatus?.bgColor} ${archiveStatus?.textColor}`}>
                              {archiveStatus?.label}
                            </span>
                          </td>
                        );
                      }

                      if (field.field === "title") {
                        return (
                          <td key={field.field}>
                            <Link
                              href={`/estates/${item.id}`}
                              target="_blank"
                              className="max-w-[300px]">
                              {item[field.field] || "__"}
                            </Link>
                          </td>
                        );
                      }

                      return (
                        <td key={field.field}>
                          <p className="max-w-[300px]">
                            {Array.isArray(item[field.field])
                              ? (item[field.field] as any[]).join("، ") || "__"
                              : item[field.field] || "__"}
                          </p>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export function AddressCell({ address }: { address: string }) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <>
      <div className="flex flex-col gap-1">
        <button
          className="text-sm text-primary hover:underline"
          onClick={() => setIsOpenModal(true)}>
          مشاهده
        </button>
      </div>
      {createPortal(
        <Modal
          isOpen={isOpenModal}
          title={
            <div>
              <div className="text-lg font-bold">آدرس</div>
            </div>
          }
          onCloseModal={() => setIsOpenModal(false)}
          onClickOutside={() => setIsOpenModal(false)}
          classNames={{
            background: "z-50 !p-4",
            box: "!max-w-lg !w-full !max-h-full overflow-y-auto !rounded-xl !h-fit",
          }}>
          <div className="flex flex-col gap-2 p-6">
            <p className="text-sm">{address}</p>
            <Button
              variant="blue"
              size="sm"
              className="mr-auto w-fit"
              onClick={() => {
                navigator.clipboard.writeText(address);

                toast.success("کپی شد");
              }}>
              <span>کپی</span>
              <ICopy className="size-4" />
            </Button>
          </div>
        </Modal>,
        document.body,
      )}
    </>
  );
}

export function OwnersCell({
  owners,
}: {
  owners: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    position: string;
    fixPhoneNumber?: string;
  }[];
}) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  // If no owners, show placeholder
  if (!owners || owners.length === 0) {
    return <span>__</span>;
  }

  // Show first owner's name or count if multiple
  const displayText =
    owners.length === 1
      ? `${owners[0].firstName} ${owners[0].lastName}`
      : `${owners.length} مالک`;

  return (
    <>
      <div className="flex flex-col gap-1">
        <button
          className="text-right text-sm text-primary hover:underline"
          onClick={() => setIsOpenModal(true)}>
          {displayText}
        </button>
      </div>
      {createPortal(
        <OwnersModal
          isOpenModal={isOpenModal}
          setIsOpenModal={setIsOpenModal}
          owners={owners}
        />,
        document.body,
      )}
    </>
  );
}

import { REQUEST_STATUS, REQUEST_TYPE } from "@/types/admin/estate/enum";
import {
  ArchiveIcon,
  CheckCircleIcon,
  ClockIcon,
  EditIcon,
  PackageIcon,
  RotateCcwIcon,
  Trash2Icon,
  XCircleIcon,
} from "lucide-react";

export const getStatusColor = (status: REQUEST_STATUS) => {
  switch (status) {
    case REQUEST_STATUS.PENDING:
      return "bg-amber-50 text-amber-700 border-amber-200";
    case REQUEST_STATUS.APPROVED:
      return "bg-green-50 text-green-700 border-green-200";
    case REQUEST_STATUS.REJECT:
      return "bg-red-50 text-red-700 border-red-200";
    case REQUEST_STATUS.DELETED:
      return "bg-gray-50 text-gray-700 border-gray-200";
    case REQUEST_STATUS.CANCEL:
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export const getTypeColor = (type: REQUEST_TYPE) => {
  switch (type) {
    case REQUEST_TYPE.EDIT:
      return "bg-blue-50 text-blue-700 border-blue-200";
    case REQUEST_TYPE.DELETE:
      return "bg-red-50 text-red-700 border-red-200";
    case REQUEST_TYPE.ARCHIVE:
      return "bg-purple-50 text-purple-700 border-purple-200";
    case REQUEST_TYPE.UNDELETE:
      return "bg-green-50 text-green-700 border-green-200";
    case REQUEST_TYPE.UNARCHIVE:
      return "bg-orange-50 text-orange-700 border-orange-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export const getTypePersianName = (type: REQUEST_TYPE) => {
  switch (type) {
    case REQUEST_TYPE.EDIT:
      return "ویرایش";
    case REQUEST_TYPE.DELETE:
      return "حذف";
    case REQUEST_TYPE.ARCHIVE:
      return "بایگانی";
    case REQUEST_TYPE.UNDELETE:
      return "خروج از حذف";
    case REQUEST_TYPE.UNARCHIVE:
      return "خروج از بایگانی";
    default:
      return type;
  }
};

export const getStatusPersianName = (status: REQUEST_STATUS) => {
  switch (status) {
    case REQUEST_STATUS.PENDING:
      return "در انتظار";
    case REQUEST_STATUS.APPROVED:
      return "تایید شده";
    case REQUEST_STATUS.REJECT:
      return "رد شده";
    case REQUEST_STATUS.DELETED:
      return "حذف شده";
    case REQUEST_STATUS.CANCEL:
      return "لغو شده";
    default:
      return status;
  }
};

export const getStatusIcon = (status: REQUEST_STATUS) => {
  switch (status) {
    case REQUEST_STATUS.PENDING:
      return <ClockIcon className="h-4 w-4" />;
    case REQUEST_STATUS.APPROVED:
      return <CheckCircleIcon className="h-4 w-4" />;
    case REQUEST_STATUS.REJECT:
      return <XCircleIcon className="h-4 w-4" />;
    case REQUEST_STATUS.DELETED:
      return <ArchiveIcon className="h-4 w-4" />;
    case REQUEST_STATUS.CANCEL:
      return <XCircleIcon className="h-4 w-4" />;
    default:
      return <ClockIcon className="h-4 w-4" />;
  }
};

export const getTypeIcon = (type: REQUEST_TYPE) => {
  switch (type) {
    case REQUEST_TYPE.EDIT:
      return <EditIcon className="h-4 w-4" />;
    case REQUEST_TYPE.DELETE:
      return <Trash2Icon className="h-4 w-4" />;
    case REQUEST_TYPE.ARCHIVE:
      return <ArchiveIcon className="h-4 w-4" />;
    case REQUEST_TYPE.UNDELETE:
      return <RotateCcwIcon className="h-4 w-4" />;
    case REQUEST_TYPE.UNARCHIVE:
      return <PackageIcon className="h-4 w-4" />;
    default:
      return <EditIcon className="h-4 w-4" />;
  }
};

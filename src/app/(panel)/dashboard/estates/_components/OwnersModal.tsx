import { ICopy } from "@/components/Icons";
import Modal from "@/components/modules/Modal";
import toast from "react-hot-toast";

export default function OwnersModal({
  isOpenModal,
  setIsOpenModal,
  owners,
}: {
  isOpenModal: boolean;
  setIsOpenModal: (isOpen: boolean) => void;
  owners: {
    id: string;
    position?: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    fixPhoneNumber?: string;
  }[];
}) {
  return (
    <Modal
      isOpen={isOpenModal}
      title={
        <div>
          <div className="text-lg font-bold">اطلاعات مالک‌ها</div>
        </div>
      }
      onCloseModal={() => setIsOpenModal(false)}
      onClickOutside={() => setIsOpenModal(false)}
      classNames={{
        background: "z-50 !p-4",
        box: "!max-w-2xl !w-full !max-h-full overflow-y-auto !rounded-xl !h-fit",
      }}>
      <div className="flex flex-col gap-4 p-6">
        {owners.map((owner, index) => (
          <div
            key={owner.id?.toString() + index?.toString()}
            className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-start gap-x-2">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-blue/10 text-sm font-bold text-primary-blue">
                  {index + 1}
                </div>
                <h3 className="text-base font-semibold text-gray-900">
                  {owner.firstName} {owner.lastName}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1 rounded-xl border border-primary-border px-5 py-3">
                  <span className="text-sm font-medium text-gray-600">
                    سمت:
                  </span>
                  <span className="text-sm text-gray-900">
                    {owner.position || "مالک"}
                  </span>
                </div>

                <div className="flex flex-col gap-1 rounded-xl border border-primary-border px-5 py-3">
                  <span className="text-sm font-medium text-gray-600">
                    شماره تماس:
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-gray-900" dir="ltr">
                      {owner.phoneNumber}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(owner.phoneNumber || "");
                        toast.success("شماره تماس کپی شد");
                      }}
                      className="text-primary-blue transition-colors hover:text-primary-blue/80"
                      title="کپی شماره">
                      <ICopy className="size-4" />
                    </button>
                  </div>
                </div>

                {owner.fixPhoneNumber && (
                  <div className="flex flex-col gap-1 rounded-xl border border-primary-border px-5 py-3 sm:col-span-2">
                    <span className="text-sm font-medium text-gray-600">
                      شماره ثابت:
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className="font-mono text-sm text-gray-900"
                        dir="ltr">
                        {owner.fixPhoneNumber}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            owner.fixPhoneNumber || "",
                          );
                          toast.success("شماره ثابت کپی شد");
                        }}
                        className="text-primary-blue transition-colors hover:text-primary-blue/80"
                        title="کپی شماره ثابت">
                        <ICopy className="size-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
